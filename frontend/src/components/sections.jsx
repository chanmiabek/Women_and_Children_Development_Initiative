import React, { useEffect, useState } from 'react';
import { featuredImages, galleryImages } from '../data/siteData.js';
import { submitNewsletter } from '../services/api.js';
import { useCmsContent } from '../hooks/useCmsContent.js';
import { saveSubscriber, saveSubmission } from '../utils/storage.js';
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
  const page = cms.pages.programs;
  return (
    <section id="programs" className="bg-white py-20">
      <SectionTitle eyebrow={page.eyebrow} title={page.title} text={page.text} />
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
        {cms.team.map((member, index) => (
          <article key={`${member.name}-${index}`} className="aos-lite hover-lift overflow-hidden rounded-xl bg-white shadow-lg">
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
        {cms.testimonials.map((item, index) => (
          <article key={`${item.name}-${index}`} className="aos-lite rounded-xl bg-gray-50 p-8 shadow">
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
  return (
    <section id="donate" className="bg-gradient-to-br from-orange-700 via-orange-600 to-rose-700 py-20 text-white">
      <SectionTitle eyebrow="Make a Difference Today" title="Your Donation Changes Lives" text="Your support helps women, children, and families access practical, lasting opportunities." />
      <div className="container mx-auto px-6">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white text-gray-900 shadow-2xl lg:grid-cols-[.85fr_1.15fr]">
          <div className="bg-gray-950 p-8 text-white sm:p-10">
            <p className="mb-3 text-sm font-bold uppercase tracking-[.2em] text-orange-300">Your impact</p>
            <h3 className="text-3xl font-bold leading-tight">Small gifts create lasting change.</h3>
            <p className="mt-5 leading-relaxed text-gray-300">Your contribution helps WCDI expand education, protection, healthcare, and economic opportunities for women and children.</p>
            <div className="mt-8 space-y-4 text-sm text-gray-200">
              <p><Icon name="fa-circle-check" className="mr-3 text-orange-400" />Secure donation processing by Donorbox</p>
              <p><Icon name="fa-circle-check" className="mr-3 text-orange-400" />One-time and recurring giving</p>
              <p><Icon name="fa-circle-check" className="mr-3 text-orange-400" />Every gift supports community-led work</p>
            </div>
          </div>
          <div className="p-4 sm:p-8">
            <div className="mb-6 flex items-start gap-4 rounded-2xl bg-orange-50 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white"><Icon name="fa-heart" /></div>
              <div><h3 className="text-xl font-bold">Make your donation</h3><p className="mt-1 text-sm leading-relaxed text-gray-600">Donorbox securely processes your gift.</p></div>
            </div>
            <iframe src="https://donorbox.org/embed/your-donation-helps-us-run-our-programs" title="Donate to Women and Children Development Initiative" className="h-[760px] w-full rounded-xl border-0 bg-white" loading="eager" allow="payment" />
          </div>
        </div>
      </div>
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
      if (!error.status || error.status >= 500) {
        saveSubscriber(email);
        saveSubmission('newsletter', { ...payload, syncStatus: 'failed', syncError: error.message });
        setEmail('');
        setMessage({ type: 'error', text: 'Subscribed locally, but backend sync is pending.' });
      } else {
        setMessage({ type: 'error', text: error.message || 'Please enter a valid email address.' });
      }
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
        {cms.events.map(({ day, month, date, title, text }) => {
          const eventDate = date ? new Date(`${date}T00:00:00`) : null;
          const displayDay = eventDate && !Number.isNaN(eventDate.getTime()) ? String(eventDate.getDate()).padStart(2, '0') : day;
          const displayMonth = eventDate && !Number.isNaN(eventDate.getTime()) ? eventDate.toLocaleDateString(undefined, { month: 'short' }).toUpperCase() : month;
          const displayDate = eventDate && !Number.isNaN(eventDate.getTime()) ? eventDate.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : `${day} ${month}`;
          return (
          <div key={`${title}-${displayDate}`} className="hover-lift overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="bg-orange-600 p-6 text-center text-white"><span className="block text-4xl font-extrabold">{displayDay}</span><span className="text-sm uppercase">{displayMonth}</span></div>
            <div className="p-6"><p className="mb-2 text-sm font-semibold uppercase tracking-wide text-orange-600"><Icon name="fa-calendar-days" className="mr-2" />{displayDate}</p><h3 className="mb-2 text-xl font-bold">{title}</h3><p className="text-gray-600">{text}</p></div>
          </div>
          );
        })}
      </div>
    </section>
  );
}

export function BlogSection({ navigate }) {
  const cms = useCmsContent();
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto grid gap-8 px-6 md:grid-cols-3">
        {cms.posts.map(({ category, title, text, image }, index) => (
          <article key={`${title}-${index}`} className="hover-lift overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="h-48 overflow-hidden"><img src={image} alt={title} className="h-full w-full object-cover transition duration-300 hover:scale-105" /></div>
            <div className="p-6"><span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">{category}</span><h3 className="mb-2 mt-4 text-xl font-bold">{title}</h3><p className="mb-4 text-gray-600">{text}</p><LinkButton href={`/blog-single?post=${index}`} navigate={navigate} className="font-semibold text-orange-600">Read More <Icon name="fa-arrow-right" className="ml-1" /></LinkButton></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function BlogPostContent() {
  const cms = useCmsContent();
  const requestedIndex = Number(new URLSearchParams(window.location.search).get('post'));
  const index = Number.isInteger(requestedIndex) && requestedIndex >= 0 && requestedIndex < cms.posts.length ? requestedIndex : 0;
  const post = cms.posts[index];
  if (!post) return null;

  return (
    <article className="bg-white py-16">
      <div className="container mx-auto max-w-4xl px-6">
        <img src={post.image} alt={post.title} className="mb-8 h-96 w-full rounded-2xl object-cover" />
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">{post.category}</span>
        <h2 className="mt-5 text-4xl font-bold text-gray-900">{post.title}</h2>
        <p className="mt-6 text-lg leading-relaxed text-gray-700">{post.text}</p>
      </div>
    </article>
  );
}

export function GetInvolved({ navigate }) {
  const cms = useCmsContent();
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto grid gap-8 px-6 md:grid-cols-3">
        {cms.involvement.map(({ icon, title, text, href }, index) => (
          <div key={`${title}-${index}`} className="hover-lift rounded-2xl bg-gray-50 p-8 shadow">
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
