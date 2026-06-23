import React from 'react';
import { Layout } from './components/Layout.jsx';
import { Newsletter } from './components/sections.jsx';
import { useReveal } from './hooks/useReveal.js';
import { useRoute } from './hooks/useRoute.js';
import { ContactPage } from './pages/ContactPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { DonationPage } from './pages/Donation.jsx';
import { FaqPage } from './pages/FaqPage.jsx';
import { GenericPage } from './pages/GenericPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { VolunteerPage } from './pages/VolunteerPage.jsx';

export default function App() {
  const [path, navigate] = useRoute();
  useReveal();

  const page = path.toLowerCase();
  const route = normalizeRoute(page);
  if (route === '/admin/dashboard') return <DashboardPage navigate={navigate} />;

  let content;
  if (route === '/') {
    content = <HomePage navigate={navigate} />;
  } else if (route === '/contact') {
    content = <ContactPage />;
  } else if (route === '/volunteer') {
    content = <VolunteerPage />;
  } else if (route === '/donate') {
    content = <DonationPage />;
  } else if (route === '/faq') {
    content = <FaqPage />;
  } else {
    const type = route.split('/').pop() || 'about';
    content = <GenericPage type={type} navigate={navigate} />;
  }

  return (
    <Layout navigate={navigate} path={path}>
      {content}
      <Newsletter />
    </Layout>
  );
}

function normalizeRoute(path) {
  let route = path.replace(/\/$/, '') || '/';

  if (route.endsWith('/index.html')) {
    route = route.replace(/\/index\.html$/i, '') || '/';
  }

  const pagesMatch = route.match(/\/pages\/([^/]+)\.html$/);
  if (pagesMatch) {
    route = `/${pagesMatch[1]}`;
  }

  if (route.endsWith('/admin/dashboard.html')) {
    route = '/admin/dashboard';
  }

  if (route.includes('/admin/dashboard')) {
    return '/admin/dashboard';
  }

  const knownRoutes = [
    'about',
    'programs',
    'get-involved',
    'events',
    'blog',
    'contact',
    'donate',
    'volunteer',
    'faq',
    'annual-report',
    'privacy-policy',
    'terms',
    'success-stories',
    'blog-single'
  ];

  const cleanRoute = route.replace(/\.html$/i, '');
  const matched = knownRoutes.find((item) => cleanRoute.endsWith(`/${item}`));
  if (matched) return `/${matched}`;

  if (!cleanRoute.includes('.') && !cleanRoute.includes('/admin/') && !cleanRoute.includes('/pages/')) {
    return cleanRoute === '/' ? '/' : `/${cleanRoute.split('/').filter(Boolean).pop() || ''}`;
  }

  return '/';
}
