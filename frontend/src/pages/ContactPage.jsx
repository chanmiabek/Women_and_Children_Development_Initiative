import React, { useState } from 'react';
import { InfoBox, Icon, PageHero } from '../components/ui.jsx';
import { saveSubmission } from '../utils/storage.js';

export function ContactPage() {
  const [status, setStatus] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    saveSubmission('contact', data);
    setStatus("Thank you for your message! We'll get back to you soon.");
    form.reset();
  };

  return (
    <>
      <PageHero eyebrow="Get in Touch" title="Contact Us" text="Have questions? We'd love to hear from you." icon="fa-envelope" />
      <section className="bg-white py-20">
        <div className="container mx-auto grid gap-8 px-6 lg:grid-cols-3">
          <form onSubmit={submit} className="rounded-2xl bg-gray-50 p-8 shadow-lg lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-2">
              <input name="name" placeholder="Your Full Name" required className="rounded-lg border px-4 py-3 focus:border-orange-600 focus:outline-none" />
              <input name="email" type="email" placeholder="Your Email Address" required className="rounded-lg border px-4 py-3 focus:border-orange-600 focus:outline-none" />
            </div>
            <input name="subject" placeholder="Subject" className="mt-6 w-full rounded-lg border px-4 py-3 focus:border-orange-600 focus:outline-none" />
            <textarea name="message" rows="6" placeholder="Your Message" required className="mt-6 w-full rounded-lg border px-4 py-3 focus:border-orange-600 focus:outline-none" />
            <button className="mt-6 rounded-lg bg-orange-600 px-8 py-3 font-semibold text-white hover:bg-orange-700">Send Message <Icon name="fa-paper-plane" className="ml-2" /></button>
            {status && <p className="mt-4 rounded-lg bg-green-100 p-3 text-green-700">{status}</p>}
          </form>
          <div className="space-y-6">
            {[
              ['fa-map-marker-alt', 'Visit Us', '123 Empowerment Street\nGlobal City, GC 12345\nUnited States'],
              ['fa-phone', 'Call Us', '+1 (888) 123-4567\n+1 (555) 987-6543\nMon-Fri, 9AM-6PM EST'],
              ['fa-envelope', 'Email Us', 'info@wcdevinitiative.org\nsupport@wcdevinitiative.org\npartnerships@wcdevinitiative.org']
            ].map(([icon, title, text]) => <InfoBox key={title} icon={icon} title={title} text={text} />)}
          </div>
        </div>
      </section>
    </>
  );
}
