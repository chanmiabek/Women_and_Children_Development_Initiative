import React, { useState } from 'react';
import { events, featuredImages, galleryImages, posts, programs } from '../data/siteData.js';
import { readJson, saveSubscriber, saveSubmission, writeJson } from '../utils/storage.js';
import { Counter, Icon, Input, LinkButton, Modal, SectionTitle } from './ui.jsx';

export function Hero({ navigate }) {
  return (
    <section id="home" className="gradient-hero overflow-hidden py-24 text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between lg:flex-row">
          <div className="aos-lite mb-12 lg:mb-0 lg:w-1/2">
            <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-6xl">Empowering Voices,<br /><span className="text-yellow-300">Transforming Lives</span></h1>
            <p className="mb-8 text-lg leading-relaxed opacity-95 lg:text-xl">Join us in creating lasting change for women and children through education, healthcare, and economic empowerment programs worldwide.</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <LinkButton href="/donate" navigate={navigate} className="rounded-full bg-white px-8 py-3 text-center font-semibold text-orange-600 transition-all hover:scale-105 hover:bg-gray-100">
                <Icon name="fa-heart" className="mr-2" />Support Our Mission
              </LinkButton>
              <LinkButton href="/about" navigate={navigate} className="rounded-full border-2 border-white px-8 py-3 text-center font-semibold transition-all hover:bg-white hover:text-orange-600">
                <Icon name="fa-play-circle" className="mr-2" />Learn More
              </LinkButton>
            </div>
            <div className="mt-8 flex items-center space-x-6">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((item) => <div key={item} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-800 bg-white"><Icon name="fa-user" className="text-sm text-gray-800" /></div>)}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-800 bg-orange-600"><span className="text-sm font-bold text-white">2k+</span></div>
              </div>
              <p className="text-sm">Join <span className="font-bold">2,000+</span> supporters making a difference</p>
            </div>
          </div>
          <div className="aos-lite lg:w-1/2">
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-full w-full rounded-2xl border-2 border-white/30" />
              <div className="relative z-10 overflow-hidden rounded-2xl bg-white/10 shadow-2xl ring-1 ring-white/20">
                <img src={featuredImages.hero} alt="WCDI community outreach gathering" className="h-[26rem] w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950/75 to-transparent p-6">
                  <p className="text-2xl font-bold">Women & Children</p>
                  <p className="mt-2 text-white/90">Development Initiative in action</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Stats() {
  const stats = [
    [15247, 'Women Empowered', 'fa-chart-line text-green-500', '+35% this year'],
    [28356, 'Children Educated', 'fa-chart-line text-green-500', '+42% this year'],
    [48, 'Communities Served', 'fa-globe text-blue-500', '12 countries'],
    [156, 'Active Partners', 'fa-handshake text-green-500', 'Global network']
  ];
  return (
    <section className="border-b border-gray-100 bg-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map(([target, label, icon, note]) => (
            <div key={label} className="aos-lite text-center">
              <Counter target={target} />
              <p className="font-semibold text-gray-600">{label}</p>
              <div className="mt-2 text-sm text-gray-500"><i className={`fas ${icon}`} /> {note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="bg-gray-50 py-20">
      <SectionTitle eyebrow="About Us" title="Making a Difference Since 2010" text="We are a non-profit organization dedicated to empowering women and children through sustainable development programs." />
      <div className="container mx-auto grid items-center gap-12 px-6 lg:grid-cols-2">
        <div className="aos-lite overflow-hidden rounded-2xl bg-white shadow-xl">
          <img src={featuredImages.about} alt="WCDI founder speaking during a community event" className="h-[28rem] w-full object-cover object-top" />
        </div>
        <div className="aos-lite">
          <h3 className="mb-4 text-2xl font-bold text-gray-800">Our Mission & Vision</h3>
          <p className="mb-6 leading-relaxed text-gray-600">To create a world where every woman and child has access to quality education, healthcare, and economic opportunities, enabling them to reach their full potential and break the cycle of poverty.</p>
          <div className="space-y-4">
            {['15+ Years of dedicated service', '50,000+ Lives transformed globally', '90% of donations go directly to programs'].map((item) => (
              <div key={item} className="flex items-start space-x-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-600"><Icon name="fa-check" className="text-xs text-white" /></div>
                <p className="text-gray-600">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-200 pt-6 text-center">
            <div><p className="text-2xl font-bold text-orange-600">Gold</p><p className="text-sm text-gray-500">Seal Rating</p></div>
            <div><p className="text-2xl font-bold text-orange-600">5 Star</p><p className="text-sm text-gray-500">Charity Rating</p></div>
            <div><p className="text-2xl font-bold text-orange-600">100%</p><p className="text-sm text-gray-500">Transparency</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProgramsSection({ navigate }) {
  return (
    <section id="programs" className="bg-white py-20">
      <SectionTitle eyebrow="What We Do" title="Our Core Programs" text="Comprehensive initiatives designed to create sustainable change" />
      <div className="container mx-auto grid gap-8 px-6 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <div key={program.title} className="aos-lite hover-lift overflow-hidden rounded-xl bg-white shadow-lg">
            <div className={`relative h-48 bg-gradient-to-r ${program.colors}`}>
              <img src={program.image} alt={`${program.title} program activity`} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gray-950/20" />
              <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow">
                <Icon name={program.icon} className="text-xl text-orange-600" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-xl font-bold">{program.title}</h3>
              <p className="mb-4 text-gray-600">{program.text}</p>
              <div className="mb-4">
                <div className="mb-1 flex justify-between text-sm"><span>Goal: {program.goal}</span><span>Raised: {program.raised}</span></div>
                <div className="h-2 rounded-full bg-gray-200"><div className="progress-bar h-2 rounded-full bg-orange-500" style={{ width: `${program.progress}%` }} /></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500"><Icon name="fa-users" className="mr-1" />{program.beneficiaries}</span>
                <LinkButton href="/donate" navigate={navigate} className="font-semibold text-orange-600 hover:text-orange-700">Donate &rarr;</LinkButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ImpactSection() {
  return (
    <section id="impact" className="bg-gray-900 py-20 text-white">
      <SectionTitle eyebrow="Impact & Results" title="Measurable Change, Human Stories" text="Our programs are designed for accountable, community-owned progress." />
      <div className="container mx-auto grid gap-8 px-6 lg:grid-cols-3">
        {['92% program efficiency', '98% beneficiary satisfaction', '48 communities served'].map((item, index) => (
          <div key={item} className="aos-lite rounded-xl bg-white/10 p-8 backdrop-blur">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-600"><Icon name={['fa-chart-pie', 'fa-heart', 'fa-globe'][index]} className="text-2xl" /></div>
            <h3 className="mb-2 text-2xl font-bold">{item}</h3>
            <p className="text-gray-300">Tracked locally in the demo dashboard and ready to connect to a live backend when available.</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function GallerySection() {
  return (
    <section id="gallery" className="bg-white py-20">
      <SectionTitle eyebrow="Field Gallery" title="WCDI Work in Photos" text="Moments from education, community dialogue, leadership, and outreach programs." />
      <div className="container mx-auto grid auto-rows-[16rem] gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {galleryImages.map(([caption, image], index) => (
          <figure key={caption} className={`aos-lite group relative overflow-hidden rounded-xl bg-gray-100 shadow-lg ${index === 2 || index === 4 || index === 9 || index === 12 ? 'lg:col-span-2' : ''}`}>
            <img src={image} alt={caption} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950/80 to-transparent p-4 text-sm font-semibold text-white">{caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function DonationSection() {
  const [amount, setAmount] = useState(null);
  const [custom, setCustom] = useState('');
  const [program, setProgram] = useState('general');
  const [recurring, setRecurring] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const selectedAmount = custom ? Number(custom) : amount;

  const submitPayment = async (event) => {
    event.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    const nextReceipt = {
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      amount: selectedAmount,
      program,
      recurring,
      date: new Date().toISOString(),
      email: event.currentTarget.cardName.value || 'Donor'
    };
    writeJson('donations', [...readJson('donations'), nextReceipt]);
    localStorage.setItem('last_receipt', JSON.stringify(nextReceipt));
    setLoading(false);
    setPaymentOpen(false);
    setReceipt(nextReceipt);
  };

  return (
    <section id="donate" className="bg-gradient-to-r from-orange-600 to-red-600 py-20 text-white">
      <SectionTitle eyebrow="Make a Difference Today" title="Your Donation Changes Lives" text="Every contribution, no matter the size, helps us reach more women and children in need." />
      <div className="container mx-auto px-6">
        <div className="aos-lite mx-auto max-w-4xl rounded-2xl bg-white p-8 text-gray-800 shadow-2xl">
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[25, 50, 100, 500].map((value) => (
              <button key={value} className={`rounded-lg py-3 font-semibold transition-all ${amount === value && !custom ? 'bg-orange-600 text-white' : 'bg-gray-100 hover:bg-orange-600 hover:text-white'}`} onClick={() => { setAmount(value); setCustom(''); }}>${value}</button>
            ))}
          </div>
          <label className="mb-2 block font-semibold text-gray-700">Custom Amount (USD)</label>
          <div className="relative mb-6">
            <span className="absolute left-4 top-3 text-gray-500">$</span>
            <input type="number" value={custom} onChange={(event) => setCustom(event.target.value)} className="w-full rounded-lg border border-gray-300 py-3 pl-8 pr-4 focus:border-orange-600 focus:outline-none" placeholder="Enter amount" />
          </div>
          <label className="mb-2 block font-semibold text-gray-700">Select a Program to Support (Optional)</label>
          <select value={program} onChange={(event) => setProgram(event.target.value)} className="mb-6 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-600 focus:outline-none">
            <option value="general">General Fund (Where needed most)</option>
            <option value="education">Education Program</option>
            <option value="healthcare">Healthcare Program</option>
            <option value="empowerment">Economic Empowerment</option>
            <option value="water">Clean Water Access</option>
            <option value="nutrition">Nutrition Program</option>
          </select>
          <label className="mb-6 flex items-center"><input type="checkbox" checked={recurring} onChange={(event) => setRecurring(event.target.checked)} className="mr-3" />Make this a monthly donation (recurring)</label>
          <button className="w-full rounded-lg bg-orange-600 py-3 text-lg font-bold text-white transition-all hover:scale-[1.01] hover:bg-orange-700" onClick={() => selectedAmount > 0 ? setPaymentOpen(true) : alert('Please select or enter a donation amount')}>
            <Icon name="fa-heart" className="mr-2" />Donate Now
          </button>
          <div className="mt-6 text-center text-sm text-gray-500">
            <span className="mx-2"><Icon name="fa-lock" className="mr-1" />Secure Payment</span>
            <span className="mx-2"><Icon name="fa-receipt" className="mr-1" />Tax Receipt Provided</span>
            <span className="mx-2"><Icon name="fa-shield-alt" className="mr-1" />100% Secure</span>
          </div>
        </div>
      </div>
      {paymentOpen && (
        <Modal onClose={() => setPaymentOpen(false)}>
          <h3 className="mb-6 text-2xl font-bold">Complete Your Donation</h3>
          <div className="mb-4 rounded-lg bg-orange-50 p-4">
            <p className="text-sm text-gray-600">Donation Amount</p>
            <p className="text-2xl font-bold text-orange-600">${selectedAmount}</p>
            {recurring && <p className="text-sm text-gray-500">Monthly Recurring</p>}
            <p className="mt-1 text-sm text-gray-500">Program: {program}</p>
          </div>
          <form onSubmit={submitPayment}>
            <Input name="cardName" label="Cardholder Name" required />
            <Input name="cardNumber" label="Card Number" placeholder="1234 5678 9012 3456" required />
            <div className="grid grid-cols-2 gap-4">
              <Input name="expiry" label="Expiry Date" placeholder="MM/YY" required />
              <Input name="cvv" label="CVV" placeholder="123" required />
            </div>
            <button disabled={loading} className="mt-4 w-full rounded-lg bg-orange-600 py-3 font-semibold text-white hover:bg-orange-700">{loading ? 'Processing...' : `Donate $${selectedAmount}`}</button>
          </form>
          <p className="mt-4 text-center text-xs text-gray-500"><Icon name="fa-lock" className="mr-1" />Secure payment processing</p>
        </Modal>
      )}
      {receipt && (
        <Modal onClose={() => setReceipt(null)}>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"><Icon name="fa-check" className="text-3xl text-green-600" /></div>
            <h3 className="mb-2 text-2xl font-bold">Thank You for Your Donation!</h3>
            <p className="mb-4 text-gray-600">Your generosity makes a difference in the lives of women and children.</p>
            <div className="mb-4 rounded-lg bg-gray-50 p-4 text-left text-sm">
              <p><strong>Transaction ID:</strong> {receipt.transactionId}</p>
              <p><strong>Amount:</strong> ${receipt.amount}</p>
              <p><strong>Program:</strong> {receipt.program}</p>
              <p><strong>Date:</strong> {new Date(receipt.date).toLocaleString()}</p>
            </div>
            <button onClick={() => window.print()} className="mr-3 rounded-lg bg-gray-600 px-6 py-2 text-white hover:bg-gray-700"><Icon name="fa-print" className="mr-2" />Print Receipt</button>
            <button onClick={() => setReceipt(null)} className="rounded-lg bg-orange-600 px-6 py-2 text-white hover:bg-orange-700">Close</button>
          </div>
        </Modal>
      )}
    </section>
  );
}

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Please enter a valid email address');
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 450));
    saveSubscriber(email);
    saveSubmission('newsletter', { email, subscribedAt: new Date().toISOString() });
    setEmail('');
    setMessage('Successfully subscribed to newsletter!');
  };

  return (
    <section className="bg-gray-900 py-16 text-white">
      <div className="container mx-auto flex flex-col items-center justify-between gap-8 px-6 md:flex-row">
        <div className="aos-lite text-center md:text-left">
          <h3 className="mb-2 text-2xl font-bold">Subscribe to Our Newsletter</h3>
          <p className="text-gray-400">Get updates on our work, success stories, and ways to help</p>
        </div>
        <form onSubmit={submit} className="aos-lite w-full md:w-auto">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" className="w-full rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 sm:w-80" required />
            <button className="rounded-lg bg-orange-600 px-6 py-3 font-semibold transition hover:scale-105 hover:bg-orange-700">Subscribe <Icon name="fa-paper-plane" className="ml-2" /></button>
          </div>
          {message && <div className={`mt-3 text-sm ${message.startsWith('Successfully') ? 'text-green-400' : 'text-red-300'}`}>{message}</div>}
        </form>
      </div>
    </section>
  );
}

export function EventsSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto grid gap-8 px-6 md:grid-cols-3">
        {events.map(([day, month, title, text]) => (
          <div key={title} className="hover-lift overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="bg-orange-600 p-6 text-center text-white"><span className="block text-4xl font-extrabold">{day}</span><span className="text-sm uppercase">{month}</span></div>
            <div className="p-6"><h3 className="mb-2 text-xl font-bold">{title}</h3><p className="text-gray-600">{text}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BlogSection({ navigate }) {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto grid gap-8 px-6 md:grid-cols-3">
        {posts.map(([category, title, text, image]) => (
          <article key={title} className="hover-lift overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="h-48 overflow-hidden"><img src={image} alt={title} className="h-full w-full object-cover transition duration-300 hover:scale-105" /></div>
            <div className="p-6"><span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">{category}</span><h3 className="mb-2 mt-4 text-xl font-bold">{title}</h3><p className="mb-4 text-gray-600">{text}</p><LinkButton href="/blog-single" navigate={navigate} className="font-semibold text-orange-600">Read More <Icon name="fa-arrow-right" className="ml-1" /></LinkButton></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function GetInvolved({ navigate }) {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto grid gap-8 px-6 md:grid-cols-3">
        {[
          ['fa-heart', 'Donate', 'Fund programs that improve education, healthcare, and economic opportunity.', '/donate'],
          ['fa-user-plus', 'Volunteer', 'Offer your skills locally or remotely through WCDI projects.', '/volunteer'],
          ['fa-handshake', 'Partner', 'Collaborate on programs, events, advocacy, and community outreach.', '/contact']
        ].map(([icon, title, text, href]) => (
          <div key={title} className="hover-lift rounded-2xl bg-gray-50 p-8 shadow">
            <Icon name={icon} className="mb-5 text-5xl text-orange-600" />
            <h3 className="mb-2 text-2xl font-bold">{title}</h3>
            <p className="mb-6 text-gray-600">{text}</p>
            <LinkButton href={href} navigate={navigate} className="font-semibold text-orange-600">Get Started &rarr;</LinkButton>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PolicyContent({ type }) {
  const lines = type === 'annual-report'
    ? ['Program efficiency remained above 90%.', 'Education, healthcare, and empowerment programs expanded across 48 communities.', 'This React dashboard keeps local demo records ready for export.']
    : ['This React frontend keeps the original demo behavior while replacing DOM scripts with component state.', 'Form submissions are stored in browser localStorage for local preview.', 'Connect a backend or Google Apps Script endpoint when production persistence is ready.'];
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="rounded-2xl bg-gray-50 p-8 shadow">
          {lines.map((line) => <p key={line} className="mb-4 text-gray-700">{line}</p>)}
        </div>
      </div>
    </section>
  );
}

export function Partners() {
  return (
    <section className="border-t border-gray-100 bg-white py-16">
      <SectionTitle title="Our Trusted Partners" text="Working together for greater impact" />
      <div className="container mx-auto grid grid-cols-2 items-center gap-8 px-6 md:grid-cols-6">
        {['UN Women', 'Global Fund', 'Red Cross', 'World Bank', 'USAID', 'WWF'].map((partner, index) => (
          <div key={partner} className="text-center grayscale transition hover:grayscale-0">
            <Icon name={['fa-building', 'fa-globe', 'fa-hand-holding-heart', 'fa-university', 'fa-chart-line', 'fa-tree'][index]} className="text-5xl text-gray-400" />
            <p className="mt-2 text-xs text-gray-500">{partner}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
