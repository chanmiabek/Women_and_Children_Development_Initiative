import React, { useState } from 'react';
import { navLinks } from '../data/siteData.js';
import { useScrollUi } from '../hooks/useScrollUi.js';
import { Icon, LinkButton } from './ui.jsx';

export function Layout({ children, navigate, path }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrolled, hidden, showTop, progress } = useScrollUi();
  //const currentYear = new Date().getFullYear();

  return (

    <div className="bg-gray-50 text-gray-900">
      <div className="fixed left-0 top-0 z-[10000] h-[3px] bg-gradient-to-r from-orange-500 to-orange-700 transition-all" style={{ width: `${progress}%` }} />
      <TopBar />
      <nav
        id="navbar"
        className={`sticky top-0 z-50 bg-white shadow-lg transition-all duration-300 ${scrolled ? 'navbar-scrolled' : ''}`}
        style={{ transform: hidden ? 'translateY(-100%)' : 'translateY(0)' }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <LinkButton href="/" navigate={navigate} className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600">
                <Icon name="fa-hands-helping" className="text-xl text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Women & Children</h2>
                <p className="text-xs font-semibold text-orange-600">Development Initiative</p>
              </div>
            </LinkButton>
            <div className="hidden space-x-8 lg:flex">
              {navLinks.map(([href, label]) => (
                <LinkButton key={href} href={href} navigate={navigate} className={`nav-link font-medium transition hover:text-orange-600 ${path === href.replace(/\/$/, '') ? 'active text-orange-600' : 'text-gray-700'}`}>
                  {label}
                </LinkButton>
              ))}
            </div>
            <div className="hidden space-x-4 lg:flex">
              <LinkButton href="/donate" navigate={navigate} className="animate-pulse-slow rounded-full bg-orange-600 px-6 py-2 font-semibold text-white transition-all hover:scale-105 hover:bg-orange-700">
                <Icon name="fa-heart" className="mr-2" />Donate Now
              </LinkButton>
              <LinkButton href="/volunteer" navigate={navigate} className="rounded-full border-2 border-orange-600 px-6 py-2 text-orange-600 transition-all hover:bg-orange-600 hover:text-white">
                <Icon name="fa-user-plus" className="mr-2" />Volunteer
              </LinkButton>
            </div>
            <button className="text-gray-700 lg:hidden" onClick={() => setMobileOpen((value) => !value)} aria-label="Open menu">
              <Icon name={mobileOpen ? 'fa-times' : 'fa-bars'} className="text-2xl" />
            </button>
          </div>
          {mobileOpen && (
            <div className="mt-4 space-y-3 pb-4 lg:hidden">
              {navLinks.map(([href, label]) => (
                <LinkButton key={href} href={href} navigate={(to) => { setMobileOpen(false); navigate(to); }} className="block py-2 text-gray-700 hover:text-orange-600">
                  {label}
                </LinkButton>
              ))}
              <LinkButton href="/donate" navigate={(to) => { setMobileOpen(false); navigate(to); }} className="block rounded-full bg-orange-600 px-6 py-2 text-center text-white">Donate Now</LinkButton>
              <LinkButton href="/volunteer" navigate={(to) => { setMobileOpen(false); navigate(to); }} className="block rounded-full border-2 border-orange-600 px-6 py-2 text-center text-orange-600">Volunteer</LinkButton>
            </div>
          )}
        </div>
      </nav>
      {children}
      <Footer navigate={navigate} />
      {showTop && (
        <button className="no-print fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-white shadow-lg transition-all hover:bg-orange-700" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
          <Icon name="fa-arrow-up" />
        </button>
      )}
      <CookieConsent />
    </div>
  );
}

function TopBar() {
  return (
    <div className="bg-gray-900 py-2 text-sm text-white">
      <div className="container mx-auto flex items-center justify-between px-6">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <span><Icon name="fa-phone-alt" className="mr-2 text-orange-500" />+254799091016</span>
          <span><Icon name="fa-envelope" className="mr-2 text-orange-500" />info@wcdevinitiative.org</span>
        </div>
        <div className="hidden space-x-4 sm:flex">
          {['facebook-f', 'twitter', 'instagram', 'linkedin-in', 'youtube'].map((item) => <a key={item} href="#" className="transition hover:text-orange-500"><i className={`fab fa-${item}`} /></a>)}
        </div>
      </div>
    </div>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="gradient-footer pt-16 pb-8 text-white">
      <div className="container mx-auto px-6">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center space-x-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600"><Icon name="fa-hands-helping" /></div><div><h3 className="text-lg font-bold">WCDI</h3><p className="text-xs text-gray-400">Est. 2018</p></div></div>
            <p className="mb-4 leading-relaxed text-gray-400">Empowering women and children through sustainable development programs worldwide.</p>
            <div className="flex space-x-4">{['facebook-f', 'twitter', 'instagram', 'linkedin-in', 'youtube'].map((item) => <a key={item} href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition hover:bg-orange-600"><i className={`fab fa-${item}`} /></a>)}</div>
          </div>
          <FooterLinks title="Quick Links" links={[['/', 'Home'], ['/about', 'About Us'], ['/programs', 'Our Programs'], ['/get-involved', 'Get Involved'], ['/contact', 'Contact']]} navigate={navigate} />
          <FooterLinks title="Resources" links={[['/annual-report', 'Annual Report 2026'], ['/privacy-policy', 'Privacy Policy'], ['/terms', 'Terms of Use'], ['/faq', 'FAQ'], ['/admin/dashboard', 'Admin Dashboard']]} navigate={navigate} />
          <div>
            <h4 className="mb-4 text-lg font-bold">Our Impact</h4>
            {[[92, 'Program Efficiency'], [100, 'Transparency Score'], [98, 'Beneficiary Satisfaction']].map(([value, label]) => (
              <div key={label} className="mb-3">
                <div className="flex justify-between"><span>{label}</span><span className="text-orange-400">{value}%</span></div>
                <div className="mt-2 h-2 rounded-full bg-gray-700"><div className="h-2 rounded-full bg-orange-500" style={{ width: `${value}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-sm text-gray-400 md:flex md:items-center md:justify-between">

          <p>&copy; 2026, Women and Children Development Initiative(WCDI). All rights reserved.</p>
          <p className="mt-2 md:mt-0">Terms| Privacy</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links, navigate }) {
  return (
    <div>
      <h4 className="mb-4 text-lg font-bold">{title}</h4>
      <ul className="space-y-2">
        {links.map(([href, label]) => <li key={href}><LinkButton href={href} navigate={navigate} className="text-gray-400 transition hover:text-white">{label}</LinkButton></li>)}
      </ul>
    </div>
  );
}

function CookieConsent() {
  const [visible, setVisible] = useState(() => !localStorage.getItem('cookieConsent'));
  if (!visible) return null;
  const choose = (choice) => {
    localStorage.setItem('cookieConsent', choice);
    setVisible(false);
  };
  return (
    <div className="no-print fixed bottom-4 left-4 right-4 z-50 rounded-xl bg-gray-900 p-4 text-white shadow-2xl md:left-auto md:max-w-md">
      <div className="flex gap-3"><Icon name="fa-cookie-bite" className="mt-1 text-orange-400" /><div><p className="font-semibold">Cookie notice</p><p className="mt-1 text-sm text-gray-300">We use essential browser storage to remember preferences and save demo form submissions on this device.</p><div className="mt-3 flex gap-2"><button onClick={() => choose('accepted')} className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold hover:bg-orange-700">Accept</button><button onClick={() => choose('declined')} className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold hover:bg-gray-600">Decline</button></div></div></div>
    </div>
  );

}
