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

function asRows(payload) {
  return Object.entries(payload)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : JSON.stringify(value)}`)
    .join('\n');
}

export async function notifyAdmin(subject, payload) {
  return sendMail({
    to: config.email.adminTo,
    subject,
    text: asRows(payload)
  });
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
