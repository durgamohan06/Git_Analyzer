import { useEffect, useState } from 'react';
import { getHealth } from '@/services/health';

export default function App() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let active = true;

    getHealth()
      .then((response) => {
        if (active) {
          setStatus(response.status);
        }
      })
      .catch(() => {
        if (active) {
          setStatus('offline');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-sky-400">Dev Weekends 2</p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">
          Frontend and backend architecture scaffolded.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Vite React TypeScript, Tailwind, and an API service layer are wired to an Express backend.
        </p>
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-sky-950/20 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">API status</p>
          <p className="mt-3 text-2xl font-medium text-sky-300">{status}</p>
        </div>
      </section>
    </main>
  );
}
