import { Router } from 'express';
import { insert, updateFirst } from '../store/jsonStore.js';
import { sendDonorReceipt, notifyAdmin } from '../services/emailService.js';
import { initiateMpesaStkPush } from '../services/mpesaService.js';
import { initializePaystackPayment, verifyPaystackPayment } from '../services/paystackService.js';
import { badRequest, cleanText, normalizeDonation } from '../utils/validation.js';

export const paymentsRouter = Router();

function paymentDonationPayload(payload, provider, extra = {}) {
  return normalizeDonation({
    ...payload,
    transactionId: payload.reference || payload.transactionId || `WCDI_${Date.now()}`,
    paymentProvider: provider,
    providerResponse: extra,
    date: new Date().toISOString()
  });
}

paymentsRouter.post('/payments/paystack/initialize', async (req, res, next) => {
  try {
    const payload = paymentDonationPayload(req.body || {}, 'paystack', { status: 'initialized' });
    const reference = payload.transactionId;
    const paystack = await initializePaystackPayment({ ...payload, reference });
    const donation = await insert('donations', {
      ...payload,
      transactionId: reference,
      paymentStatus: 'pending',
      authorizationUrl: paystack.data?.authorization_url || '',
      providerResponse: paystack
    });
    res.status(201).json({
      ok: true,
      message: 'Paystack payment initialized.',
      data: {
        donation,
        authorizationUrl: paystack.data?.authorization_url,
        accessCode: paystack.data?.access_code,
        reference
      }
    });
  } catch (error) {
    next(error);
  }
});

paymentsRouter.get('/payments/paystack/verify/:reference', async (req, res, next) => {
  try {
    const reference = cleanText(req.params.reference, 120);
    if (!reference) throw badRequest('Payment reference is required.');

    const verification = await verifyPaystackPayment(reference);
    const status = verification.data?.status === 'success' ? 'paid' : verification.data?.status || 'failed';
    const donation = await updateFirst(
      'donations',
      (item) => item.transactionId === reference,
      {
        paymentStatus: status,
        providerResponse: verification,
        paidAt: status === 'paid' ? new Date().toISOString() : undefined
      }
    );

    if (donation && status === 'paid') {
      await Promise.allSettled([
        sendDonorReceipt(donation),
        notifyAdmin('WCDI donation paid', donation)
      ]);
    }

    res.json({ ok: true, message: 'Paystack payment verified.', data: { status, donation, verification } });
  } catch (error) {
    next(error);
  }
});

paymentsRouter.post('/payments/mpesa/stk-push', async (req, res, next) => {
  try {
    const payload = paymentDonationPayload(req.body || {}, 'mpesa', { status: 'stk_push_requested' });
    const phone = cleanText(req.body?.phone, 40);
    if (!phone) throw badRequest('Phone number is required for M-Pesa payments.', { field: 'phone' });

    const reference = payload.transactionId;
    const mpesa = await initiateMpesaStkPush({
      ...payload,
      phone,
      reference,
      description: `WCDI ${payload.program} donation`
    });
    const donation = await insert('donations', {
      ...payload,
      phone,
      transactionId: reference,
      paymentStatus: 'pending',
      checkoutRequestId: mpesa.CheckoutRequestID,
      merchantRequestId: mpesa.MerchantRequestID,
      providerResponse: mpesa
    });

    res.status(201).json({
      ok: true,
      message: 'M-Pesa STK Push sent. Complete the prompt on your phone.',
      data: { donation, reference, mpesa }
    });
  } catch (error) {
    next(error);
  }
});

paymentsRouter.post('/payments/mpesa/callback', async (req, res, next) => {
  try {
    const callback = req.body?.Body?.stkCallback || req.body?.stkCallback || {};
    const checkoutRequestId = callback.CheckoutRequestID;
    const resultCode = Number(callback.ResultCode);
    const paymentStatus = resultCode === 0 ? 'paid' : 'failed';
    const metadata = callback.CallbackMetadata?.Item || [];
    const receipt = metadata.find((item) => item.Name === 'MpesaReceiptNumber')?.Value;

    const donation = await updateFirst(
      'donations',
      (item) => item.checkoutRequestId === checkoutRequestId,
      {
        paymentStatus,
        mpesaReceiptNumber: receipt,
        providerResponse: req.body,
        paidAt: paymentStatus === 'paid' ? new Date().toISOString() : undefined
      }
    );

    if (donation && paymentStatus === 'paid') {
      await Promise.allSettled([
        sendDonorReceipt(donation),
        notifyAdmin('WCDI M-Pesa donation paid', donation)
      ]);
    }

    res.json({ ResultCode: 0, ResultDesc: 'Callback received successfully' });
  } catch (error) {
    next(error);
  }
});
