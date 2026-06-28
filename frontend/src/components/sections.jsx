import React, { useEffect, useState } from 'react';
import { featuredImages, galleryImages } from '../data/siteData.js';
import { initiateMpesaPayment, submitDonation, submitNewsletter, verifyPaystackPayment } from '../services/api.js';
import { useCmsContent } from '../hooks/useCmsContent.js';
import { usePaymentConfig } from '../hooks/usePayment.js';
import { readJson, saveSubscriber, saveSubmission, writeJson } from '../utils/storage.js';
import { Counter, Icon, Input, LinkButton, Modal, SectionTitle } from './ui.jsx';

export function Hero({ navigate }) {
  const cms = useCmsContent();
  const page = cms.pages.home;
  const titleParts = page.title.split(',');
  return (
    <section id="home" className="home-hero-bg relative overflow-hidden py-24 text-white" style={{ backgroundImage: `url("${page.backgroundImage || featuredImages.hero}")` }}>
      <div className="absolute inset-0 bg-gray-950/65" />
      <div className="relative z-10 container mx-auto px-6">
        <div className="flex min-h-[28rem] items-center">
          <div className="aos-lite max-w-3xl">
            <p className="mb-3 font-semibold uppercase tracking-wide text-yellow-300">{page.eyebrow}</p>
            <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-6xl">{titleParts[0]}{titleParts[1] && <><br /><span className="text-yellow-300">{titleParts.slice(1).join(',').trim()}</span></>}</h1>
            <p className="mb-8 text-lg leading-relaxed opacity-95 lg:text-xl">{page.text}</p>
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
  const cms = useCmsContent();
  const about = cms.about;
  return (
    <section id="about" className="bg-gray-50 py-20">
      <SectionTitle eyebrow={cms.pages.about.eyebrow} title={about.sectionTitle} text={about.sectionText} />
      <div className="container mx-auto grid items-center gap-12 px-6 lg:grid-cols-2">
        <div className="aos-lite overflow-hidden rounded-2xl bg-white shadow-xl">
          <img src={featuredImages.about} alt="WCDI founder speaking during a community event" className="h-[28rem] w-full object-cover object-top" />
        </div>
        <div className="aos-lite">
          <h3 className="mb-4 text-2xl font-bold text-gray-800">{about.missionTitle}</h3>
          <p className="mb-6 leading-relaxed text-gray-600">{about.missionText}</p>
          <div className="space-y-4">
            {about.bullets.map((item) => (
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
  const cms = useCmsContent();
  return (
    <section id="programs" className="bg-white py-20">
      <SectionTitle eyebrow={cms.pages.programs.eyebrow} title="Our Core Programs" text="Comprehensive initiatives designed to create sustainable change" />
      <div className="container mx-auto grid gap-8 px-6 md:grid-cols-2 lg:grid-cols-3">
        {cms.programs.map((program) => (
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

export function TeamSection() {
  const cms = useCmsContent();
  return (
    <section className="bg-gray-50 py-20">
      <SectionTitle eyebrow="Our Team" title="People Behind the Mission" text="Meet the team coordinating WCDI programs, partnerships, and community outreach." />
      <div className="container mx-auto grid gap-8 px-6 md:grid-cols-2 lg:grid-cols-3">
        {cms.team.map((member) => (
          <article key={member.name} className="aos-lite hover-lift overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="h-72 bg-gray-100">
              <img src={member.image} alt={member.name} className="h-full w-full object-cover object-top" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
              <p className="mt-1 font-semibold text-orange-600">{member.role}</p>
              <p className="mt-4 text-gray-600">{member.bio}</p>
              {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" aria-label={`${member.name} LinkedIn profile`} title="LinkedIn" className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-800"><i className="fab fa-linkedin-in" /></a>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const cms = useCmsContent();
  return (
    <section className="bg-white py-20">
      <SectionTitle eyebrow="Testimonials" title="What People Say" text="Stories from families, volunteers, and partners connected to WCDI programs." />
      <div className="container mx-auto grid gap-8 px-6 lg:grid-cols-3">
        {cms.testimonials.map((item) => (
          <article key={item.name} className="aos-lite rounded-xl bg-gray-50 p-8 shadow">
            <Icon name="fa-quote-left" className="mb-5 text-4xl text-orange-500" />
            <p className="text-lg leading-relaxed text-gray-700">"{item.quote}"</p>
            <div className="mt-6 flex items-center gap-4">
              <img src={item.image} alt={item.name} className="h-14 w-14 rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.role}</p>
                {item.linkedin && <a href={item.linkedin} target="_blank" rel="noreferrer" aria-label={`${item.name} LinkedIn profile`} title="LinkedIn" className="mt-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-800"><i className="fab fa-linkedin-in" /></a>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DonationSection() {
  const defaultAmount = Number(import.meta.env.VITE_DEFAULT_DONATION_AMOUNT || 200);
  const defaultEmail = import.meta.env.VITE_DEFAULT_DONOR_EMAIL || 'donor@wcdi.org';
  const [amount, setAmount] = useState(defaultAmount);
  const [program, setProgram] = useState('general');
  const [recurring, setRecurring] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [donor, setDonor] = useState({ name: '', email: defaultEmail, phone: '' });
  const [paymentError, setPaymentError] = useState('');
  const [reference, setReference] = useState(() => `WCDI_${Date.now()}`);
  const [provider, setProvider] = useState('');
  const selectedAmount = amount;
  const paymentConfig = usePaymentConfig({ amount: selectedAmount, email: donor.email, reference });
  const mpesaEnabled = import.meta.env.VITE_ENABLE_MPESA !== 'false';
  const paystackPaymentPageUrl = import.meta.env.VITE_PAYSTACK_PAYMENT_PAGE_URL || '';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paystackReference = params.get('reference') || params.get('trxref');
    if (!paystackReference) return;

    let active = true;
    verifyPaystackPayment(paystackReference)
      .then((verification) => {
        if (!active) return;
        const savedReceipt = JSON.parse(localStorage.getItem('last_receipt') || 'null');
        const verifiedReceipt = {
          ...(savedReceipt || {}),
          transactionId: paystackReference,
          paymentProvider: 'paystack',
          paymentStatus: verification.data?.status || 'paid',
          providerResponse: verification,
          date: savedReceipt?.date || new Date().toISOString()
        };
        storeReceipt(verifiedReceipt);
        window.history.replaceState({}, '', window.location.pathname);
      })
      .catch((error) => {
        if (!active) return;
        setPaymentError(error.message);
      });

    return () => {
      active = false;
    };
  }, []);

  const buildReceipt = (paymentReference = {}, paymentProvider = provider) => ({
    transactionId: paymentReference.reference || paymentReference.trxref || paymentReference.transactionId || reference,
    amount: selectedAmount,
    program,
    recurring,
    donorName: donor.name,
    email: donor.email,
    phone: donor.phone,
    currency: paymentConfig.currency,
    paymentProvider,
    date: new Date().toISOString(),
    providerResponse: paymentReference
  });

  const storeReceipt = (nextReceipt) => {
    writeJson('donations', [...readJson('donations'), nextReceipt]);
    localStorage.setItem('last_receipt', JSON.stringify(nextReceipt));
    setPaymentOpen(false);
    setReceipt(nextReceipt);
  };

  const recordDonation = async (paymentReference = {}, paymentProvider = provider) => {
    setLoading(true);
    setPaymentError('');
    const nextReceipt = buildReceipt(paymentReference, paymentProvider);
    try {
      await submitDonation(nextReceipt);
      storeReceipt(nextReceipt);
    } catch (error) {
      storeReceipt({ ...nextReceipt, syncStatus: 'failed', syncError: error.message });
    } finally {
      setLoading(false);
    }
  };

  const startMpesaPayment = async () => {
    if (!donor.email || !donor.phone) {
      setPaymentError('Please enter your email and M-Pesa phone number before continuing.');
      return;
    }
    if (!(selectedAmount > 0)) {
      setPaymentError('Please enter a donation amount.');
      return;
    }
    setLoading(true);
    setPaymentError('');
    const nextReceipt = buildReceipt({ reference }, 'mpesa');
    try {
      const response = await initiateMpesaPayment({
        ...nextReceipt,
        reference,
        phone: donor.phone
      });
      storeReceipt({
        ...nextReceipt,
        paymentStatus: 'pending',
        checkoutRequestId: response.data?.mpesa?.CheckoutRequestID,
        providerResponse: response,
        mpesaMessage: 'STK Push sent. Complete the payment prompt on your phone.'
      });
    } catch (error) {
      setPaymentError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openPayment = (method) => {
    setDonor({ name: '', email: defaultEmail, phone: '' });
    setAmount(defaultAmount);
    setPaymentError('');
    setProvider(method);
    setReference(`WCDI_${Date.now()}`);
    setPaymentOpen(true);
  };

  const openPaystackPaymentPage = () => {
    setPaymentError('');
    if (!paystackPaymentPageUrl) {
      setPaymentError('Add VITE_PAYSTACK_PAYMENT_PAGE_URL to frontend/.env to let donors enter amount on Paystack.');
    }
  };

  const startDemoPayment = () => {
    if (!donor.email) {
      setPaymentError('Please enter your email address before continuing.');
      return;
    }
    if (!(selectedAmount > 0)) {
      setPaymentError('Please enter a donation amount.');
      return;
    }
    recordDonation({ reference, status: 'demo_success' }, 'demo');
  };

  return (
    <section id="donate" className="bg-gradient-to-r from-orange-600 to-red-600 py-20 text-white">
      <SectionTitle eyebrow="Make a Difference Today" title="Your Donation Changes Lives" text="Every contribution, no matter the size, helps us reach more women and children in need." />
      <div className="container mx-auto px-6">
        <div className="aos-lite mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          <a
            href={paystackPaymentPageUrl || undefined}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
              if (!paystackPaymentPageUrl) {
                event.preventDefault();
                openPaystackPaymentPage();
              } else {
                setPaymentError('');
              }
            }}
            className="rounded-lg border-2 border-white bg-white px-8 py-5 text-center text-xl font-bold text-[#00A9D6] shadow-xl transition hover:scale-[1.01] hover:bg-sky-50"
          >
            <Icon name="fa-credit-card" className="mr-3" />Paystack
          </a>
          <button type="button" onClick={() => openPayment('mpesa')} disabled={!mpesaEnabled} className="rounded-lg border-2 border-white bg-white px-8 py-5 text-xl font-bold text-green-700 shadow-xl transition hover:scale-[1.01] hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60">
            <Icon name="fa-mobile-screen" className="mr-3" />M-Pesa
          </button>
        </div>
        {paymentError && <p className="mx-auto mt-4 max-w-3xl rounded-lg bg-white/95 p-3 text-sm text-red-700">{paymentError}</p>}
      </div>
      {paymentOpen && (
        <Modal onClose={() => setPaymentOpen(false)}>
          <h3 className="mb-6 text-2xl font-bold">M-Pesa Donation</h3>
          <div className="mb-2 rounded-xl bg-gray-50 p-4">
            <Input name="donorName" label="Full Name" value={donor.name} onChange={(event) => setDonor((value) => ({ ...value, name: event.target.value }))} required />
            <Input name="donorEmail" type="email" label="Email Address" value={donor.email} onChange={(event) => setDonor((value) => ({ ...value, email: event.target.value }))} required />
            <Input name="donorPhone" type="tel" label="M-Pesa Phone Number" value={donor.phone} onChange={(event) => setDonor((value) => ({ ...value, phone: event.target.value }))} required />
            <Input name="donationAmount" type="number" label={`Amount (${paymentConfig.currency})`} value={amount} onChange={(event) => setAmount(event.target.value)} required />
          </div>
          {paymentError && <p className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">{paymentError}</p>}
          <button type="button" disabled={loading || !donor.email || !donor.phone || !(selectedAmount > 0)} onClick={startMpesaPayment} className="w-full rounded-lg bg-green-600 px-5 py-3 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Sending prompt...' : 'Pay with M-Pesa'}
          </button>
          <p className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">Enter your M-Pesa phone number, then complete the STK Push prompt on your phone.</p>
          <p className="mt-4 text-center text-xs text-gray-500"><Icon name="fa-lock" className="mr-1" />Secure payment processing via configured provider</p>
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
              <p><strong>Amount:</strong> {receipt.currency || 'KES'} {receipt.amount}</p>
              <p><strong>Program:</strong> {receipt.program}</p>
              <p><strong>Donor:</strong> {receipt.donorName || receipt.email || 'Donor'}</p>
              <p><strong>Date:</strong> {new Date(receipt.date).toLocaleString()}</p>
              {receipt.paymentStatus && <p><strong>Status:</strong> {receipt.paymentStatus}</p>}
              {receipt.mpesaMessage && <p className="mt-2 text-green-700"><strong>M-Pesa:</strong> {receipt.mpesaMessage}</p>}
              {receipt.syncStatus === 'failed' && <p className="mt-2 text-orange-700"><strong>Backend sync:</strong> Pending</p>}
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
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }
    const payload = { email, source: 'website', subscribedAt: new Date().toISOString() };
    setLoading(true);
    try {
      await submitNewsletter(payload);
      saveSubscriber(email);
      saveSubmission('newsletter', payload);
      setEmail('');
      setMessage({ type: 'success', text: 'Successfully subscribed to newsletter!' });
    } catch (error) {
      saveSubscriber(email);
      saveSubmission('newsletter', { ...payload, syncStatus: 'failed', syncError: error.message });
      setEmail('');
      setMessage({ type: 'error', text: 'Subscribed locally, but backend sync is pending.' });
    } finally {
      setLoading(false);
    }
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
            <button disabled={loading} className="rounded-lg bg-orange-600 px-6 py-3 font-semibold transition hover:scale-105 hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Subscribing...' : 'Subscribe'} <Icon name="fa-paper-plane" className="ml-2" /></button>
          </div>
          {message.text && <div className={`mt-3 text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-300'}`}>{message.text}</div>}
        </form>
      </div>
    </section>
  );
}

export function EventsSection() {
  const cms = useCmsContent();
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto grid gap-8 px-6 md:grid-cols-3">
        {cms.events.map(({ day, month, title, text }) => (
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
  const cms = useCmsContent();
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto grid gap-8 px-6 md:grid-cols-3">
        {cms.posts.map(({ category, title, text, image }) => (
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
  const cms = useCmsContent();
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto grid gap-8 px-6 md:grid-cols-3">
        {cms.involvement.map(({ icon, title, text, href }) => (
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
    ? ['WCDI continues to prioritize transparent, community-led impact across education, healthcare, women empowerment, nutrition, and child protection programs.', 'Program resources are directed toward practical support such as school supplies, mentorship, health outreach, food assistance, skills training, and family strengthening activities.', 'We track participation, donation records, volunteer activity, and program outcomes so supporters and partners can understand how their contributions are helping women, children, and families move forward.']
    : ['Women and Children Development Initiative respects the privacy and dignity of every supporter, volunteer, donor, and community member who connects with us.', 'Information shared through contact, volunteer, newsletter, and donation forms is used only to respond to requests, coordinate programs, process support, and communicate relevant WCDI updates.', 'We protect submitted information with responsible access controls and do not sell personal data. Donors and subscribers may contact WCDI at any time to update their details or request removal from communication lists.'];
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
