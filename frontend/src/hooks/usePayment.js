import { useMemo } from 'react';

export function usePaymentConfig({ amount, email, reference }) {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
  const currency = import.meta.env.VITE_PAYMENT_CURRENCY || 'KES';

  return useMemo(() => ({
    enabled: Boolean(publicKey),
    publicKey,
    currency,
    email: email || 'donor@wcdi.org',
    amount: Math.max(Number(amount || 0), 0) * 100,
    reference: reference || `WCDI_${Date.now()}`
  }), [amount, currency, email, publicKey, reference]);
}
