import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DataTable, Icon } from '../components/ui.jsx';
import { adminLogin, fetchContent, fetchDashboard, hasBackend, saveContent, submitContact, submitNewsletter, submitVolunteer, uploadImage } from '../services/api.js';
import { editablePages, readCmsContent, resetCmsContent, writeCmsContent } from '../utils/cms.js';
import { formatDate, normalizeSubscriberEmail, readJson, removeSubmission } from '../utils/storage.js';

const ADMIN_SESSION_KEY = 'wcdi_admin_session';

export function DashboardPage({ navigate }) {
  const [session, setSession] = useState(readAdminSession);
  const authenticated = Boolean(session?.token);
  const [activePanel, setActivePanel] = useState('content');
  const [tick, setTick] = useState(0);
  const [remoteData, setRemoteData] = useState(null);
  const [remoteStatus, setRemoteStatus] = useState(hasBackend() ? 'Ready to sync' : 'Local preview mode');
  const [cms, setCms] = useState(() => readCmsContent());
  const [activePage, setActivePage] = useState('home');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!session?.expiresAt) return undefined;
    const remaining = new Date(session.expiresAt).getTime() - Date.now();
    if (!Number.isFinite(remaining) || remaining <= 0) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      setSession(null);
      return undefined;
    }
    const timer = window.setTimeout(() => {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      setSession(null);
    }, remaining);
    return () => window.clearTimeout(timer);
  }, [session?.expiresAt]);

  const data = useMemo(() => {
    if (remoteData) return normalizeDashboard(remoteData);
    const contacts = readJson('contact_submissions');
    const volunteers = readJson('volunteer_submissions');
    const newsletter = readJson('newsletter_submissions');
    const subscribers = readJson('newsletter_subscribers');
    const emails = [...new Set([...subscribers.map(normalizeSubscriberEmail), ...newsletter.map((item) => item.email)].filter(Boolean))];
    return { contacts, volunteers, newsletter, subscribers, emails };
  }, [remoteData, tick]);

  useEffect(() => {
    if (!authenticated || !hasBackend()) return undefined;
    let active = true;
    setRemoteStatus('Syncing backend data...');
    fetchDashboard(session.token)
      .then((payload) => {
        if (!active) return;
        setRemoteData(payload);
        setRemoteStatus('Backend data loaded');
      })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401) {
          localStorage.removeItem(ADMIN_SESSION_KEY);
          setSession(null);
          return;
        }
        setRemoteData(null);
        setRemoteStatus('Backend unavailable, showing local preview');
      });
    return () => {
      active = false;
    };
  }, [authenticated, session?.token, tick]);

  useEffect(() => {
    if (!authenticated || !hasBackend()) return undefined;
    let active = true;
    const pending = [
      ['contact', readJson('contact_submissions'), submitContact],
      ['volunteer', readJson('volunteer_submissions'), submitVolunteer],
      ['newsletter', readJson('newsletter_submissions'), submitNewsletter]
    ].flatMap(([type, items, submitter]) => items.filter((item) => item.syncStatus === 'failed').map((item) => ({ type, item, submitter })));

    if (!pending.length) return undefined;
    setRemoteStatus(`Syncing ${pending.length} pending submission${pending.length === 1 ? '' : 's'}...`);
    (async () => {
      for (const { type, item, submitter } of pending) {
        if (!active) return;
        const { syncStatus, syncError, localId, timestamp, ...payload } = item;
        try {
          await submitter(payload);
          removeSubmission(type, item);
        } catch {
          // Keep failed submissions locally for the next retry.
        }
      }
      if (active) setTick((value) => value + 1);
    })();
    return () => {
      active = false;
    };
  }, [authenticated, session?.token]);

  useEffect(() => {
    if (!authenticated || !hasBackend()) return undefined;
    fetchContent().then((remote) => {
      if (remote) setCms(remote);
    }).catch(() => undefined);
    return undefined;
  }, [authenticated, session?.token]);

  const publishTimer = useRef(null);
  const pendingCms = useRef(null);

  useEffect(() => () => window.clearTimeout(publishTimer.current), []);

  if (!authenticated) {
    return <AdminLogin navigate={navigate} onLogin={(nextSession) => setSession(nextSession)} />;
  }

  const publishCms = async (nextCms, status) => {
    try {
      const saved = await saveContent(nextCms, session.token);
      if (pendingCms.current?.content === nextCms) {
        pendingCms.current = null;
        if (saved) {
          setCms(saved);
          writeCmsContent(saved);
          setMessage(`${status} and published live`);
        } else setMessage(`${status} locally`);
      }
    } catch (error) {
      if (error.status === 401) {
        localStorage.removeItem(ADMIN_SESSION_KEY);
        setSession(null);
        return;
      }
      if (pendingCms.current?.content === nextCms) setMessage(`${status} locally; live sync failed`);
    }
    window.setTimeout(() => setMessage(''), 2200);
  };

  const saveCms = (nextCms, status = 'Changes saved') => {
    setCms(nextCms);
    writeCmsContent(nextCms);
    pendingCms.current = { content: nextCms, status };
    window.clearTimeout(publishTimer.current);
    publishTimer.current = window.setTimeout(() => {
      const pending = pendingCms.current;
      if (pending) publishCms(pending.content, pending.status);
    }, 600);
  };

  const updatePage = (field, value) => {
    saveCms({
      ...cms,
      pages: {
        ...cms.pages,
        [activePage]: { ...cms.pages[activePage], [field]: value }
      }
    });
  };

  const updateAbout = (field, value) => {
    saveCms({ ...cms, about: { ...cms.about, [field]: value } });
  };

  const updateCollection = (collection, index, field, value) => {
    const items = cms[collection].map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item);
    saveCms({ ...cms, [collection]: items });
  };

  const addItem = (collection, item) => {
    saveCms({ ...cms, [collection]: [...cms[collection], item] }, 'Item created');
  };

  const deleteItem = (collection, index) => {
    saveCms({ ...cms, [collection]: cms[collection].filter((_, itemIndex) => itemIndex !== index) }, 'Item deleted');
  };

  const uploadCmsImage = async (file) => {
    const result = await uploadImage(file, session.token);
    return result.secure_url;
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setSession(null);
  };

  const exportData = () => {
    const payload = { cms, activity: data, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `wcdi-admin-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 lg:flex">
      <aside className="bg-gray-950 p-6 text-white lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:overflow-y-auto">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-600"><Icon name="fa-screwdriver-wrench" /></div>
          <div><h1 className="text-xl font-bold">Admin Tools</h1><p className="text-xs text-gray-400">Content manager</p></div>
        </div>
        <nav className="space-y-2">
          {[
            ['content', 'Manage Content', 'fa-pen-to-square'],
            ['activity', 'Overview', 'fa-chart-line'],
            ['submissions', 'Submissions', 'fa-inbox']
          ].map(([key, label, icon]) => (
            <button key={key} onClick={() => setActivePanel(key)} className={`block w-full rounded-lg px-4 py-3 text-left hover:bg-white/10 ${activePanel === key ? 'bg-white/10 text-orange-300' : ''}`}>
              <Icon name={icon} className="mr-2" />{label}
            </button>
          ))}
          <button onClick={() => navigate('/')} className="block w-full rounded-lg px-4 py-3 text-left hover:bg-white/10"><Icon name="fa-eye" className="mr-2" />View Website</button>
          <button onClick={logout} className="block w-full rounded-lg px-4 py-3 text-left text-red-200 hover:bg-red-500/10"><Icon name="fa-right-from-bracket" className="mr-2" />Logout</button>
        </nav>
      </aside>
      <main className="flex-1">
        <header className="sticky top-0 z-30 flex flex-col gap-4 border-b bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div><p className="text-sm font-semibold uppercase tracking-wide text-orange-600">{activePanel === 'content' ? 'Website content management' : remoteStatus}</p><h2 className="text-3xl font-bold">WCDI Website Dashboard</h2><p className="mt-1 text-sm text-gray-500">Keep your public website current, clear, and impactful.</p>{cms.updatedAt && <p className="mt-1 text-xs text-gray-400">Last published: {formatDate(cms.updatedAt)}</p>}{message && <p className="mt-2 text-sm font-semibold text-green-700">{message}</p>}</div>
          <div className="flex flex-wrap gap-3">
            <button onClick={exportData} className="rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-800"><Icon name="fa-download" className="mr-2" />Export JSON</button>
            <button onClick={() => setTick((value) => value + 1)} className="rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"><Icon name="fa-rotate" className="mr-2" />Refresh</button>
          </div>
        </header>

        {activePanel === 'content' && (
          <section className="space-y-6 p-6">
            <div className="rounded-xl bg-white p-6 shadow">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div><h3 className="text-xl font-bold">Page Sections</h3><p className="text-sm text-gray-500">Edit hero content for Home, About, Programs, Get Involved, Events, and Blog.</p></div>
                <select value={activePage} onChange={(event) => setActivePage(event.target.value)} className="rounded-lg border px-4 py-3">
                  {editablePages.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                </select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <AdminInput label="Eyebrow" value={cms.pages[activePage].eyebrow || ''} onChange={(value) => updatePage('eyebrow', value)} />
                <AdminInput label="Icon class" value={cms.pages[activePage].icon || ''} onChange={(value) => updatePage('icon', value)} />
                <AdminInput label="Title" value={cms.pages[activePage].title || ''} onChange={(value) => updatePage('title', value)} />
                <AdminImageInput label="Background image" value={cms.pages[activePage].backgroundImage || ''} onChange={(value) => updatePage('backgroundImage', value)} />
                <AdminTextArea label="Description" value={cms.pages[activePage].text || ''} onChange={(value) => updatePage('text', value)} className="md:col-span-2" />
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              <h3 className="mb-5 text-xl font-bold">About Section</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <AdminInput label="Section title" value={cms.about.sectionTitle} onChange={(value) => updateAbout('sectionTitle', value)} />
                <AdminInput label="Mission title" value={cms.about.missionTitle} onChange={(value) => updateAbout('missionTitle', value)} />
                <AdminTextArea label="Section text" value={cms.about.sectionText} onChange={(value) => updateAbout('sectionText', value)} />
                <AdminTextArea label="Mission text" value={cms.about.missionText} onChange={(value) => updateAbout('missionText', value)} />
                <AdminTextArea label="Bullet points, one per line" value={cms.about.bullets.join('\n')} onChange={(value) => updateAbout('bullets', value.split('\n').filter(Boolean))} className="md:col-span-2" />
              </div>
            </div>

            <CollectionEditor onUploadImage={uploadCmsImage} title="Programs" collection="programs" items={cms.programs} fields={programFields} onAdd={() => addItem('programs', createProgram())} onDelete={deleteItem} onUpdate={updateCollection} />
            <CollectionEditor onUploadImage={uploadCmsImage} title="Events" collection="events" items={cms.events} fields={eventFields} onAdd={() => addItem('events', createEvent())} onDelete={deleteItem} onUpdate={updateCollection} />
            <CollectionEditor onUploadImage={uploadCmsImage} title="Blog Posts" collection="posts" items={cms.posts} fields={postFields} onAdd={() => addItem('posts', createPost())} onDelete={deleteItem} onUpdate={updateCollection} />
            <CollectionEditor onUploadImage={uploadCmsImage} title="Team Members" collection="team" items={cms.team} fields={teamFields} onAdd={() => addItem('team', createTeamMember())} onDelete={deleteItem} onUpdate={updateCollection} />
            <CollectionEditor onUploadImage={uploadCmsImage} title="Testimonials" collection="testimonials" items={cms.testimonials} fields={testimonialFields} onAdd={() => addItem('testimonials', createTestimonial())} onDelete={deleteItem} onUpdate={updateCollection} />
            <CollectionEditor onUploadImage={uploadCmsImage} title="Get Involved Cards" collection="involvement" items={cms.involvement} fields={involvementFields} onAdd={() => addItem('involvement', createInvolvement())} onDelete={deleteItem} onUpdate={updateCollection} />

            <div className="rounded-xl bg-white p-6 shadow">
              <h3 className="mb-2 text-xl font-bold">Reset Content</h3>
              <p className="mb-4 text-sm text-gray-600">Restore all editable website content to the original frontend defaults.</p>
              <button onClick={() => saveCms(resetCmsContent(), 'Website content restored')} className="rounded-lg border border-red-300 px-5 py-3 font-semibold text-red-700 hover:bg-red-50">Reset Website Content</button>
            </div>
          </section>
        )}

        {activePanel === 'activity' && <OverviewPanel data={data} />}
        {activePanel === 'submissions' && <SubmissionsPanel data={data} />}
      </main>
    </div>
  );
}

function AdminLogin({ navigate, onLogin }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setError('');
    setLoading(true);
    try {
      const session = await adminLogin(data);
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      onLogin(session);
    } catch (error) {
      setError(error.message || 'Invalid admin username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-gray-950 px-6 text-white">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 text-gray-900 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-white"><Icon name="fa-lock" /></div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-500">Sign in to create, edit, update, and delete website content.</p>
        </div>
        <AdminInput label="Username" name="username" />
        <AdminInput label="Password" name="password" type="password" />
        {error && <p className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="w-full rounded-lg bg-orange-600 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Signing in...' : 'Login'}</button>
        <button type="button" onClick={() => navigate('/')} className="mt-3 w-full rounded-lg border py-3 font-semibold text-gray-700 hover:bg-gray-50">Back to Website</button>
        <p className="mt-4 text-center text-xs text-gray-500">Admin access is verified by the backend. Keep credentials only in backend environment variables.</p>
      </form>
    </main>
  );
}

function OverviewPanel({ data }) {
  return (
    <section id="overview" className="p-6">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {[
          ['Contact Messages', data.contacts.length, 'text-orange-600'],
          ['Volunteer Applications', data.volunteers.length, 'text-blue-600'],
          ['Newsletter Subscribers', data.emails.length, 'text-green-600'],
        ].map(([label, count, color]) => <div key={label} className="metric-card rounded-xl bg-white p-6 shadow"><p className="text-sm text-gray-500">{label}</p><p className={`mt-2 text-4xl font-bold ${color}`}>{count}</p></div>)}
      </div>
    </section>
  );
}

function SubmissionsPanel({ data }) {
  return (
    <section className="grid gap-6 p-6 xl:grid-cols-2">
      <DataTable title="Recent Contact Messages" columns={['Name', 'Email', 'Subject', 'Date']} rows={data.contacts.slice(-8).reverse().map((item) => [item.name || '-', item.email || '-', item.subject || '-', formatDate(item.timestamp)])} empty="No contact messages stored yet." />
      <DataTable title="Volunteer Applications" columns={['Name', 'Email', 'Availability', 'Date']} rows={data.volunteers.slice(-8).reverse().map((item) => [item.fullName || '-', item.email || '-', item.availability || '-', formatDate(item.timestamp)])} empty="No volunteer applications stored yet." />
      <div className="overflow-hidden rounded-xl bg-white shadow"><div className="border-b p-6"><h3 className="text-xl font-bold">Newsletter Subscribers</h3></div><div className="flex flex-wrap gap-2 p-6">{data.emails.length ? data.emails.map((email) => <span key={email} className="rounded-full bg-green-50 px-3 py-2 text-sm text-green-700">{email}</span>) : <p className="text-gray-500">No newsletter subscribers stored yet.</p>}</div></div>
    </section>
  );
}

function CollectionEditor({ onUploadImage, title, collection, items, fields, onAdd, onDelete, onUpdate }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div><h3 className="text-xl font-bold">{title}</h3><p className="text-sm text-gray-500">Add, edit, update, or delete items.</p></div>
        <button onClick={onAdd} className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700"><Icon name="fa-plus" className="mr-2" />Add</button>
      </div>
      <div className="space-y-5">
        {items.map((item, index) => (
          <div key={index} className="rounded-xl border p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="font-semibold">{item.title || `${title} item ${index + 1}`}</p>
              <button onClick={() => onDelete(collection, index)} className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"><Icon name="fa-trash" className="mr-2" />Delete</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => {
                if (field.type === 'textarea') {
                  return <AdminTextArea key={field.name} label={field.label} value={item[field.name] || ''} onChange={(value) => onUpdate(collection, index, field.name, value)} className={field.full ? 'md:col-span-2' : ''} />;
                }
                if (field.type === 'image') {
                  return <AdminImageInput key={field.name} label={field.label} value={item[field.name] || ''} onUpload={async (file) => { const imageUrl = await onUploadImage(file); onUpdate(collection, index, field.name, imageUrl); }} onChange={(value) => onUpdate(collection, index, field.name, value)} className={field.full ? 'md:col-span-2' : ''} />;
                }
                return <AdminInput key={field.name} label={field.label} value={item[field.name] || ''} type={field.type || 'text'} onChange={(value) => onUpdate(collection, index, field.name, field.type === 'number' ? Number(value) : value)} />;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminInput({ label, value, onChange, className = '', ...props }) {
  return (
    <label className={`mb-4 block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-gray-700">{label}</span>
      <input value={value} onChange={onChange ? (event) => onChange(event.target.value) : undefined} className="w-full rounded-lg border px-4 py-3 focus:border-orange-600 focus:outline-none" {...props} />
    </label>
  );
}

function AdminTextArea({ label, value, onChange, className = '' }) {
  return (
    <label className={`mb-4 block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-gray-700">{label}</span>
      <textarea value={value} rows="4" onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border px-4 py-3 focus:border-orange-600 focus:outline-none" />
    </label>
  );
}

function AdminImageInput({ label, value, onChange, onUpload, className = '' }) {
  const [uploading, setUploading] = useState(false);
  const upload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      setUploading(true);
      try {
        if (onUpload) await onUpload(file);
        else onChange(reader.result);
      } catch (error) {
        window.alert(error.message || 'Image upload failed.');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <div className={`mb-4 block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-gray-700">{label}</span>
      {value && (
        <div className="mb-3 overflow-hidden rounded-lg border bg-gray-50">
          <img src={value} alt={`${label} preview`} className="h-40 w-full object-cover" />
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <label className="inline-flex cursor-pointer items-center rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800">
          <Icon name="fa-upload" className="mr-2" />{uploading ? 'Uploading to Cloudinary…' : 'Upload Image'}
          <input type="file" accept="image/*" onChange={upload} className="sr-only" />
        </label>
        {value && <button type="button" onClick={() => onChange('')} className="rounded-lg border border-red-300 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-50"><Icon name="fa-trash" className="mr-2" />Remove</button>}
      </div>
      <p className="mt-2 text-xs text-gray-500">Images up to 10 MB upload securely to Cloudinary and are published with your CMS changes.</p>
    </div>
  );
}

const programFields = [
  { name: 'title', label: 'Title' },
  { name: 'icon', label: 'Icon class' },
  { name: 'colors', label: 'Gradient classes' },
  { name: 'goal', label: 'Goal' },
  { name: 'raised', label: 'Raised' },
  { name: 'progress', label: 'Progress', type: 'number' },
  { name: 'beneficiaries', label: 'Beneficiaries' },
  { name: 'image', label: 'Image', type: 'image', full: true },
  { name: 'text', label: 'Description', type: 'textarea', full: true }
];

const eventFields = [
  { name: 'date', label: 'Event date', type: 'date' },
  { name: 'day', label: 'Day' },
  { name: 'month', label: 'Month' },
  { name: 'title', label: 'Title' },
  { name: 'text', label: 'Description', type: 'textarea', full: true }
];

const postFields = [
  { name: 'category', label: 'Category' },
  { name: 'title', label: 'Title' },
  { name: 'image', label: 'Image', type: 'image', full: true },
  { name: 'text', label: 'Excerpt', type: 'textarea', full: true }
];

const teamFields = [
  { name: 'name', label: 'Name' },
  { name: 'role', label: 'Role' },
  { name: 'image', label: 'Image', type: 'image', full: true },
  { name: 'linkedin', label: 'LinkedIn URL' },
  { name: 'bio', label: 'Bio', type: 'textarea', full: true }
];

const testimonialFields = [
  { name: 'name', label: 'Name' },
  { name: 'role', label: 'Role' },
  { name: 'image', label: 'Image', type: 'image', full: true },
  { name: 'linkedin', label: 'LinkedIn URL' },
  { name: 'quote', label: 'Quote', type: 'textarea', full: true }
];

const involvementFields = [
  { name: 'icon', label: 'Icon class' },
  { name: 'title', label: 'Title' },
  { name: 'href', label: 'Link' },
  { name: 'text', label: 'Description', type: 'textarea', full: true }
];

function createProgram() {
  return { title: 'New Program', icon: 'fa-hands-helping', colors: 'from-orange-500 to-orange-600', image: '', text: 'Describe this program.', goal: '$0', raised: '$0', progress: 0, beneficiaries: '0 beneficiaries' };
}

function createEvent() {
  return { date: new Date().toISOString().slice(0, 10), day: '01', month: 'JAN', title: 'New Event', text: 'Describe this event.' };
}

function createPost() {
  return { category: 'Update', title: 'New Story', text: 'Write a short story excerpt.', image: '' };
}

function createTeamMember() {
  return { name: 'New Team Member', role: 'Role title', bio: 'Write a short biography.', image: '', linkedin: '' };
}

function createTestimonial() {
  return { name: 'New Testimonial', role: 'Community member', quote: 'Write the testimonial quote.', image: '', linkedin: '' };
}

function createInvolvement() {
  return { icon: 'fa-hands-helping', title: 'New Action', text: 'Describe this way to get involved.', href: '/contact' };
}

function normalizeDashboard(payload) {
  const contacts = payload.contacts || payload.contact_submissions || [];
  const volunteers = payload.volunteers || payload.volunteer_submissions || [];
  const newsletter = payload.newsletter || payload.newsletter_submissions || [];
  const subscribers = payload.subscribers || payload.newsletter_subscribers || [];
  const emails = [...new Set([...subscribers.map(normalizeSubscriberEmail), ...newsletter.map((item) => item.email)].filter(Boolean))];
  return { contacts, volunteers, newsletter, subscribers, emails };
}

function readAdminSession() {
  try {
    const session = JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY) || 'null');
    const expiresAt = session?.expiresAt ? new Date(session.expiresAt).getTime() : null;
    if (!session?.token || (session.expiresAt && (!Number.isFinite(expiresAt) || expiresAt <= Date.now()))) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return null;
  }
}
