import { Link } from "react-router-dom";
import { NAV_LINKS } from "../data/market";
import { Logo } from "./Ui";

const YEAR = new Date().getFullYear();

const socials = [
  { label: "X", href: "https://x.com", path: "M4 4l7.2 8.8L4.4 20H7l5.1-5.8L16.8 20H22l-7.6-9.3L21.4 4H18.8l-4.7 5.4L9.2 4H4z" },
  { label: "LinkedIn", href: "https://www.linkedin.com", path: "M6 9H3.5v11H6V9zM4.8 4.2A1.6 1.6 0 1 0 4.8 7.4 1.6 1.6 0 0 0 4.8 4.2zM20.5 13.3c0-3-1.6-4.4-3.8-4.4-1.8 0-2.6 1-3.1 1.7V9H11v11h2.6v-5.5c0-.3 0-.6.1-.8.3-.6.8-1.3 1.8-1.3 1.3 0 1.8 1 1.8 2.4V20H20.5v-6.7z" },
  { label: "YouTube", href: "https://www.youtube.com", path: "M22 12.2s0-3.2-.4-4.6c-.2-.8-.9-1.5-1.7-1.7C18.4 5.5 12 5.5 12 5.5s-6.4 0-7.9.4c-.8.2-1.5.9-1.7 1.7C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.8.9 1.5 1.7 1.7 1.5.4 7.9.4 7.9.4s6.4 0 7.9-.4c.8-.2 1.5-.9 1.7-1.7.4-1.4.4-4.6.4-4.6zM10 15.5v-6.6l5.2 3.3-5.2 3.3z" },
  { label: "Instagram", href: "https://www.instagram.com", path: "M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm8 2H8a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3zm-4 3.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2zM17.4 7.1a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#05080f]">
      <div className="shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
            A full-width trading desk for indices, stocks, watchlists, and simulated orders. Built to be read at a glance.
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-slate-200 transition hover:-translate-y-0.5 hover:border-amber-300/60 hover:text-amber-200"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d={item.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-300">Quick links</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            {NAV_LINKS.map((link) => (
              <li key={link.to}><Link className="hover:text-amber-200" to={link.to}>{link.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-300">Platform</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li><Link className="hover:text-amber-200" to="/trade">Trade ticket</Link></li>
            <li><Link className="hover:text-amber-200" to="/stocks">Trending stocks</Link></li>
            <li><Link className="hover:text-amber-200" to="/privacy">Privacy Policy</Link></li>
            <li><Link className="hover:text-amber-200" to="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-300">Contact</h2>
          <address className="mt-4 space-y-2 text-sm leading-6 text-slate-400 not-italic">
            <p>Aurix Markets</p>
            <p>40 Wall Street, 28th Floor<br />New York, NY 10005</p>
            <p><a className="hover:text-amber-200" href="mailto:hello@aurix.markets">hello@aurix.markets</a></p>
            <p><a className="hover:text-amber-200" href="tel:+12125550198">+1 (212) 555-0198</a></p>
          </address>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-4 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {YEAR} Aurix Markets. Demo interface.</p>
          <p className="max-w-3xl">
            Quotes, news, and orders are simulated on this device and are not live market data, investment advice, or an offer to transact.
          </p>
        </div>
      </div>
    </footer>
  );
}
