import React, { useState } from 'react';
import { PageHero } from '../components/ui.jsx';
import { submitVolunteer } from '../services/api.js';
import { saveSubmission } from '../utils/storage.js';
import youthImage from '../../assets/images/youth.jpeg';

export function VolunteerPage() {
  const skills = ['Teaching', 'Healthcare', 'Fundraising', 'Event Planning', 'Mentorship', 'Translation', 'Design', 'Research'];
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const toggle = (skill) => setSelected((items) => items.includes(skill) ? items.filter((item) => item !== skill) : [...items, skill]);
  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = { ...Object.fromEntries(new FormData(form)), skills: selected, source: 'website' };
    setLoading(true);
    setStatus({ type: '', text: '' });
    try {
      await submitVolunteer(data);
      saveSubmission('volunteer', data);
      form.reset();
      setSelected([]);
      setStatus({ type: 'success', text: "Thank you for applying to volunteer! We'll contact you soon." });
    } catch (error) {
      saveSubmission('volunteer', { ...data, syncStatus: 'failed', syncError: error.message });
      setStatus({ type: 'error', text: 'Application saved locally, but the backend could not be reached.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero eyebrow="Join the Mission" title="Volunteer With WCDI" text="Bring your time, skills, and care to programs that move communities forward." icon="fa-user-plus" backgroundImage={youthImage} />
      <section className="bg-gray-50 py-20">
        <form onSubmit={submit} className="container mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-xl">
          <div className="grid gap-6 md:grid-cols-2">
            <input name="fullName" placeholder="Full Name" required className="rounded-lg border px-4 py-3" />
            <input name="email" type="email" placeholder="Email Address" required className="rounded-lg border px-4 py-3" />
            <input name="phone" type="tel" placeholder="Phone Number" required className="rounded-lg border px-4 py-3" />
            <input name="occupation" placeholder="Occupation" className="rounded-lg border px-4 py-3" />
            <input name="age" type="number" placeholder="Age" className="rounded-lg border px-4 py-3" />
            <select name="availability" className="rounded-lg border px-4 py-3"><option>Weekends</option><option>Weekdays</option><option>Evenings</option><option>Flexible</option></select>
          </div>
          <p className="mb-3 mt-6 font-semibold text-gray-700">Skills and interests</p>
          <div className="mb-6 flex flex-wrap gap-2">
            {skills.map((skill) => <button type="button" key={skill} onClick={() => toggle(skill)} className={`rounded-full px-4 py-2 transition ${selected.includes(skill) ? 'bg-orange-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{skill}</button>)}
          </div>
          <textarea name="motivation" rows="4" placeholder="Why do you want to volunteer?" className="mb-6 w-full rounded-lg border px-4 py-3" />
          <textarea name="experience" rows="4" placeholder="Previous volunteer experience" className="mb-6 w-full rounded-lg border px-4 py-3" />
          <button disabled={loading} className="rounded-lg bg-orange-600 px-8 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Submitting...' : 'Submit Application'}</button>
          {status.text && <p className={`mt-4 rounded-lg p-3 ${status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{status.text}</p>}
        </form>
      </section>
    </>
  );
}
