import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { DEMO_CREDENTIALS } from '../../data/constants';
import { IconHome, IconInbox, IconLogout, IconPin, IconSettings, IconGrid } from '../../components/Icons';
import { useSeo } from '../../hooks/useSeo';

function Login() {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  useSeo({ title: 'Admin Login', description: 'Agent dashboard login.' });

  const submit = (e) => {
    e.preventDefault();
    if (!login(email, password)) setError('Incorrect email or password.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy p-4 on-navy">
      <div className="w-full max-w-md rounded-card bg-cream p-7 shadow-lift sm:p-9">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-gold"><IconHome size={24} /></span>
          <div><h1 className="font-serif text-2xl font-semibold">Agent dashboard</h1><p className="text-sm text-slate-600">Sign in to manage listings</p></div>
        </div>

        <div className="mb-5 rounded-ctl border border-amber-300 bg-amber-50 p-3.5 text-sm text-amber-950" role="note">
          <p className="font-semibold">Demo login (placeholder only)</p>
          <p className="mt-1">Email <code className="rounded bg-white px-1">{DEMO_CREDENTIALS.email}</code> · Password <code className="rounded bg-white px-1">{DEMO_CREDENTIALS.password}</code></p>
          <p className="mt-1 text-xs">Replace with real authentication (e.g. Supabase Auth or Firebase Auth) before launch. See the README.</p>
          <button type="button" className="mt-2 text-xs font-semibold underline" onClick={() => { setEmail(DEMO_CREDENTIALS.email); setPassword(DEMO_CREDENTIALS.password); setError(''); }}>Fill demo credentials</button>
        </div>

        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="adm-email" className="label">Email</label>
            <input id="adm-email" type="email" className="input" autoComplete="username" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} aria-invalid={!!error} aria-describedby={error ? 'adm-err' : undefined} required />
          </div>
          <div>
            <label htmlFor="adm-pass" className="label">Password</label>
            <input id="adm-pass" type="password" className="input" autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} aria-invalid={!!error} aria-describedby={error ? 'adm-err' : undefined} required />
          </div>
          {error && <p id="adm-err" role="alert" className="field-error !text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full">Sign in</button>
        </form>
        <p className="mt-5 text-center text-sm"><Link to="/" className="text-navy underline-offset-2 hover:underline">← Back to website</Link></p>
      </div>
    </div>
  );
}

function AdminLayout() {
  const { logout, inquiries } = useStore();
  const navigate = useNavigate();
  const unread = inquiries.filter((i) => !i.read).length;
  const nav = [
    { to: '/admin', label: 'Dashboard', Icon: IconGrid, end: true },
    { to: '/admin/listings', label: 'Listings', Icon: IconPin },
    { to: '/admin/inquiries', label: 'Inquiries', Icon: IconInbox, badge: unread },
    { to: '/admin/agent', label: 'Agent profile', Icon: IconSettings },
  ];
  const cls = ({ isActive }) =>
    `flex shrink-0 items-center gap-2.5 rounded-ctl px-3.5 py-2.5 text-sm font-medium transition ${isActive ? 'bg-gold text-navy' : 'text-white/85 hover:bg-white/10'}`;

  return (
    <div className="min-h-screen bg-cream md:flex">
      <aside className="on-navy bg-navy text-white md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3 md:flex-col md:items-stretch md:gap-6 md:p-5">
          <Link to="/admin" className="flex items-center gap-2.5 font-serif text-lg font-semibold"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold text-navy"><IconHome size={20} /></span>Admin</Link>
          <button type="button" onClick={() => { logout(); navigate('/admin'); }} className="flex items-center gap-2 rounded-ctl px-3 py-2 text-sm text-white/85 hover:bg-white/10 md:hidden"><IconLogout size={18} /> Sign out</button>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 scrollbar-none md:flex-col md:overflow-visible md:pb-0">
          {nav.map(({ to, label, Icon, end, badge }) => (
            <NavLink key={to} to={to} end={end} className={cls}>
              <Icon size={18} />{label}
              {badge > 0 && <span className="ml-auto rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white" aria-label={`${badge} unread`}>{badge}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="hidden space-y-1 border-t border-white/10 p-3 md:absolute md:inset-x-0 md:bottom-0 md:block">
          <Link to="/" className="block rounded-ctl px-3.5 py-2.5 text-sm text-white/85 hover:bg-white/10">View public site ↗</Link>
          <button type="button" onClick={() => { logout(); navigate('/admin'); }} className="flex w-full items-center gap-2.5 rounded-ctl px-3.5 py-2.5 text-sm text-white/85 hover:bg-white/10"><IconLogout size={18} /> Sign out</button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10"><Outlet /></main>
    </div>
  );
}

export default function AdminGate() {
  const { authed } = useStore();
  useEffect(() => {
    const m = document.createElement('meta');
    m.name = 'robots'; m.content = 'noindex,nofollow';
    document.head.appendChild(m);
    return () => m.remove();
  }, []);
  return authed ? <AdminLayout /> : <Login />;
}
