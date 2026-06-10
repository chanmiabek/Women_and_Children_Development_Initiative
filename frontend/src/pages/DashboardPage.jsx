import React, { useMemo, useState } from 'react';
import { DataTable, Icon } from '../components/ui.jsx';
import { formatDate, normalizeSubscriberEmail, readJson } from '../utils/storage.js';

export function DashboardPage({ navigate }) {
  const [tick, setTick] = useState(0);
  const data = useMemo(() => {
    const contacts = readJson('contact_submissions');
    const volunteers = readJson('volunteer_submissions');
    const newsletter = readJson('newsletter_submissions');
    const subscribers = readJson('newsletter_subscribers');
    const donations = readJson('donations');
    const emails = [...new Set([...subscribers.map(normalizeSubscriberEmail), ...newsletter.map((item) => item.email)].filter(Boolean))];
    return { contacts, volunteers, newsletter, subscribers, donations, emails };
  }, [tick]);

  const exportData = () => {
    const payload = { ...data, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `wcdi-dashboard-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 lg:flex">
      <aside className="bg-gray-950 p-6 text-white lg:w-72">
        <div className="mb-10 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-600"><Icon name="fa-hands-helping" /></div><div><h1 className="text-xl font-bold">WCDI Admin</h1><p className="text-xs text-gray-400">Operations Dashboard</p></div></div>
        <nav className="space-y-2">
          {['Overview', 'Submissions', 'Donations'].map((item) => <a key={item} href={`#${item.toLowerCase()}`} className="block rounded-lg px-4 py-3 hover:bg-white/10">{item}</a>)}
          <button onClick={() => navigate('/')} className="block w-full rounded-lg px-4 py-3 text-left hover:bg-white/10">View Website</button>
        </nav>
      </aside>
      <main className="flex-1">
        <header className="flex flex-col gap-4 border-b bg-white p-6 md:flex-row md:items-center md:justify-between">
          <div><p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Real-time local preview</p><h2 className="text-3xl font-bold">Website Activity</h2></div>
          <div className="flex gap-3"><button onClick={exportData} className="rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-800"><Icon name="fa-download" className="mr-2" />Export JSON</button><button onClick={() => setTick((value) => value + 1)} className="rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"><Icon name="fa-rotate" className="mr-2" />Refresh</button></div>
        </header>
        <section id="overview" className="p-6"><div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">{[['Contact Messages', data.contacts.length, 'text-orange-600'], ['Volunteer Applications', data.volunteers.length, 'text-blue-600'], ['Newsletter Subscribers', data.emails.length, 'text-green-600'], ['Donation Records', data.donations.length, 'text-purple-600']].map(([label, count, color]) => <div key={label} className="metric-card rounded-xl bg-white p-6 shadow"><p className="text-sm text-gray-500">{label}</p><p className={`mt-2 text-4xl font-bold ${color}`}>{count}</p></div>)}</div></section>
        <section id="submissions" className="grid gap-6 p-6 pt-0 xl:grid-cols-2">
          <DataTable title="Recent Contact Messages" columns={['Name', 'Email', 'Subject', 'Date']} rows={data.contacts.slice(-8).reverse().map((item) => [item.name || '-', item.email || '-', item.subject || '-', formatDate(item.timestamp)])} empty="No contact messages stored yet." />
          <DataTable title="Volunteer Applications" columns={['Name', 'Email', 'Availability', 'Date']} rows={data.volunteers.slice(-8).reverse().map((item) => [item.fullName || '-', item.email || '-', item.availability || '-', formatDate(item.timestamp)])} empty="No volunteer applications stored yet." />
        </section>
        <section id="donations" className="grid gap-6 p-6 pt-0 xl:grid-cols-2">
          <DataTable title="Donation Records" columns={['Transaction', 'Amount', 'Program', 'Date']} rows={data.donations.slice(-8).reverse().map((item) => [item.transactionId || '-', `$${item.amount || 0}`, item.program || '-', formatDate(item.date || item.timestamp)])} empty="No donation records stored yet." />
          <div className="overflow-hidden rounded-xl bg-white shadow"><div className="border-b p-6"><h3 className="text-xl font-bold">Newsletter Subscribers</h3></div><div className="flex flex-wrap gap-2 p-6">{data.emails.length ? data.emails.map((email) => <span key={email} className="rounded-full bg-green-50 px-3 py-2 text-sm text-green-700">{email}</span>) : <p className="text-gray-500">No newsletter subscribers stored yet.</p>}</div></div>
        </section>
      </main>
    </div>
  );
}
