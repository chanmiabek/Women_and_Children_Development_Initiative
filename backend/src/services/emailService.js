import nodemailer from 'nodemailer';
import { config } from '../config.js';

let transporter;

function getTransporter() {
  if (!config.email.enabled) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: config.email.user ? {
        user: config.email.user,
        pass: config.email.pass
      } : undefined
    });
  }
  return transporter;
}

async function sendMail(message) {
  const mailer = getTransporter();
  if (!mailer || !message.to) return { skipped: true };
  return mailer.sendMail({
    from: config.email.from,
    ...message
  });
}

export async function sendAdminOtp(email, code, expiresInMinutes) {
  if (!config.email.enabled || !config.email.host || !config.email.from) {
    const error = new Error('Admin email delivery is not configured.');
    error.status = 503;
    throw error;
  }
  try {
    return await sendMail({
      to: email,
      subject: 'Your WCDI admin sign-in code',
      text: `Your WCDI admin sign-in code is ${code}. It expires in ${expiresInMinutes} minutes. If you did not request it, you can ignore this email.`
    });
  } catch (error) {
    console.error('[email] Admin OTP delivery failed.', error);
    const deliveryError = new Error('Could not send the sign-in code. Check the backend Gmail SMTP settings and app password.');
    deliveryError.status = 503;
    deliveryError.details = { providerCode: error.code || undefined };
    throw deliveryError;
  }
}

function asRows(payload) {
  return Object.entries(payload)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : JSON.stringify(value)}`)
    .join('\n');
}

export async function notifyAdmin(subject, payload) {
  try {
    const result = await sendMail({
      to: config.email.adminTo,
      replyTo: payload.email || undefined,
      subject,
      text: asRows(payload)
    });
    if (result.skipped) {
      console.warn(`[email] Skipped "${subject}": set EMAIL_ENABLED=true and ADMIN_EMAIL in the backend environment.`);
    }
    return result;
  } catch (error) {
    console.error(`[email] Could not send "${subject}" to the configured admin address.`, error);
    return { skipped: true, failed: true };
  }
}

export async function sendSubscriberWelcome(subscriber) {
  return sendMail({
    to: subscriber.email,
    subject: 'Welcome to WCDI updates',
    text: [
      'Thank you for subscribing to Women and Children Development Initiative updates.',
      'We will share program news, stories, and ways to support the mission.'
    ].join('\n')
  });
}
