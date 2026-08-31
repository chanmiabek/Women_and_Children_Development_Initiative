import React, { useState } from 'react';
import { Icon, PageHero } from '../components/ui.jsx';

export function FaqPage() {
  const items = [
    ['How are donations used?', 'Most donations go directly to education, healthcare, empowerment, water, and nutrition programs.'],
    ['Can I volunteer remotely?', 'Yes. Remote volunteers can help with mentoring, translation, communications, research, and fundraising.'],
    ['Will I receive a donation receipt?', 'Donorbox provides donation confirmations and receipts after a successful gift.'],
    ['How do I partner with WCDI?', 'Use the contact page to share your organization, goals, and preferred collaboration area.']
  ];
  const [open, setOpen] = useState(0);
  return (
    <>
      <PageHero eyebrow="Help Center" title="Frequently Asked Questions" text="Quick answers about giving, volunteering, programs, and transparency." icon="fa-question-circle" />
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto max-w-3xl px-6">
          {items.map(([question, answer], index) => (
            <div key={question} className="mb-4 overflow-hidden rounded-xl bg-white shadow">
              <button onClick={() => setOpen(open === index ? -1 : index)} className={`flex w-full items-center justify-between p-5 text-left font-semibold ${open === index ? 'bg-orange-600 text-white' : 'bg-gray-50 text-gray-800'}`}>
                {question}<Icon name={open === index ? 'fa-minus' : 'fa-plus'} />
              </button>
              {open === index && <p className="p-5 text-gray-600">{answer}</p>}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
