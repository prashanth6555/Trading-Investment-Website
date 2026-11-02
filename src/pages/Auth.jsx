import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useMarket } from "../hooks/useMarket";

function AuthShell({ title, text, children }) {
  return (
    <section className="grid min-h-[calc(100vh-7.5rem)] lg:grid-cols-2">
      <div className="relative hidden min-h-full lg:block">
        <img src="/images/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060910] via-[#060910]/75 to-[#060910]/30" />
        <div className="relative flex h-full flex-col justify-end p-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-200">Aurix desk</p>
          <h2 className="mt-3 max-w-md font-display text-5xl text-white">The order is not finished until you confirm it.</h2>
        </div>
      </div>
      <div className="flex items-center px-4 py-12 sm:px-8 lg:px-14">
        <div className="w-full max-w-md">
          <h1 className="font-display text-4xl text-white">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </section>
  );
}

function emailOk(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function Login() {
  const { user, login } = useMarket();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) return <Navigate to="/portfolio" replace />;

  const submit = (event) => {
    event.preventDefault();
    if (!emailOk(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const name = email.split("@")[0].replace(/[.\-_]/g, " ");
    login({ name: name.replace(/\b\w/g, (letter) => letter.toUpperCase()), email });
    navigate("/portfolio");
  };

  return (
    <AuthShell title="Welcome back" text="Demo login. Any valid email and a password of 6 or more characters opens the desk. Nothing is sent to a server.">
      <form className="space-y-3" onSubmit={submit}>
        <label className="block text-sm text-slate-300">Email
          <input className="field mt-1.5" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="block text-sm text-slate-300">Password
          <input className="field mt-1.5" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
        <button type="submit" className="btn btn-gold w-full">Login</button>
      </form>
      <p className="mt-4 text-sm text-slate-400">New here? <Link className="font-semibold text-amber-200" to="/signup">Create an account</Link></p>
    </AuthShell>
  );
}

export function Signup() {
  const { user, login } = useMarket();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", agree: false });
  const [error, setError] = useState("");

  if (user) return <Navigate to="/portfolio" replace />;

  const set = (key) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    if (form.name.trim().length < 2) {
      setError("Enter your name.");
      return;
    }
    if (!emailOk(form.email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Use at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.agree) {
      setError("Agree to the demo terms to continue.");
      return;
    }
    login({ name: form.name.trim(), email: form.email.trim() });
    navigate("/portfolio");
  };

  return (
    <AuthShell title="Create your login" text="This account lives in the current browser session. Use it to see your name on the desk.">
      <form className="space-y-3" onSubmit={submit}>
        <label className="block text-sm text-slate-300">Full name
          <input className="field mt-1.5" autoComplete="name" value={form.name} onChange={set("name")} />
        </label>
        <label className="block text-sm text-slate-300">Email
          <input className="field mt-1.5" type="email" autoComplete="email" value={form.email} onChange={set("email")} />
        </label>
        <label className="block text-sm text-slate-300">Password
          <input className="field mt-1.5" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} />
        </label>
        <label className="block text-sm text-slate-300">Confirm password
          <input className="field mt-1.5" type="password" autoComplete="new-password" value={form.confirm} onChange={set("confirm")} />
        </label>
        <div className="flex items-start gap-2 text-sm text-slate-300">
          <input id="agree" type="checkbox" className="mt-1" checked={form.agree} onChange={set("agree")} />
          <p>
            <label htmlFor="agree">I agree to the demo terms. </label>
            <Link className="text-amber-200" to="/terms">Terms</Link>
            {" and "}
            <Link className="text-amber-200" to="/privacy">Privacy Policy</Link>.
          </p>
        </div>
        {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
        <button type="submit" className="btn btn-gold w-full">Sign up</button>
      </form>
      <p className="mt-4 text-sm text-slate-400">Already registered? <Link className="font-semibold text-amber-200" to="/login">Login</Link></p>
    </AuthShell>
  );
}
