import React, { useEffect, useState } from 'react';

export function Icon({ name, className = '' }) {
  return <i className={`fas ${name} ${className}`} aria-hidden="true" />;
}

export function LinkButton({ href, navigate, children, className }) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        event.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
}

export function Counter({ target }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = document.querySelector(`[data-counter="${target}"]`);
    if (!node) return undefined;
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const started = performance.now();
      const tick = (time) => {
        const pct = Math.min((time - started) / 2000, 1);
        setValue(Math.floor(target * pct));
        if (pct < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.5 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  return <div data-counter={target} className="mb-2 text-4xl font-bold text-orange-600 md:text-5xl">{value.toLocaleString()}</div>;
}

export function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="aos-lite mx-auto mb-12 max-w-3xl px-6 text-center">
      {eyebrow && <span className="font-semibold uppercase tracking-wide text-orange-600">{eyebrow}</span>}
      <h2 className="mb-4 mt-2 text-3xl font-bold text-gray-800 md:text-4xl">{title}</h2>
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, text, icon }) {
  return (
    <section className="gradient-hero py-20 text-white">
      <div className="container mx-auto px-6 text-center">
        {eyebrow && <p className="mb-2 font-semibold uppercase tracking-wide text-yellow-300">{eyebrow}</p>}
        <Icon name={icon} className="mb-5 text-6xl" />
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">{title}</h1>
        <p className="mx-auto max-w-3xl text-lg text-white/90">{text}</p>
      </div>
    </section>
  );
}

export function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="modal-panel max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-8 text-gray-900 shadow-2xl">
        <button className="float-right text-2xl text-gray-400 hover:text-gray-600" onClick={onClose} aria-label="Close">&times;</button>
        {children}
      </div>
    </div>
  );
}

export function Input({ label, name, ...props }) {
  return (
    <label className="mb-4 block">
      <span className="mb-2 block text-gray-700">{label}</span>
      <input name={name} className="w-full rounded-lg border px-4 py-2 focus:border-orange-600 focus:outline-none" {...props} />
    </label>
  );
}

export function InfoBox({ icon, title, text }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-6 shadow-sm">
      <div className="mb-4 flex items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100"><Icon name={icon} className="text-xl text-orange-600" /></div>
        <h3 className="ml-4 text-xl font-bold">{title}</h3>
      </div>
      <p className="ml-16 whitespace-pre-line text-gray-600">{text}</p>
    </div>
  );
}

export function DataTable({ title, columns, rows, empty }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <div className="border-b p-6"><h3 className="text-xl font-bold">{title}</h3></div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>{columns.map((col) => <th key={col} className="p-4 text-left">{col}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length ? rows.map((row, index) => (
              <tr key={index} className="border-t">
                {row.map((cell, cellIndex) => <td key={cellIndex} className={`p-4 ${cellIndex === 0 ? 'font-medium' : ''}`}>{cell}</td>)}
              </tr>
            )) : (
              <tr><td colSpan={columns.length} className="p-6 text-center text-gray-500">{empty}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
