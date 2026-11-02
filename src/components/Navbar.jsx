import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { NAV_LINKS } from "../data/market";
import { useMarket } from "../hooks/useMarket";
import { cx } from "../lib/format";
import { Logo } from "./Ui";

function linkClass(active) {
  return cx(
    "rounded-full px-3 py-2 text-sm font-semibold transition",
    active ? "bg-white/10 text-amber-200" : "text-slate-300 hover:bg-white/5 hover:text-white",
  );
}

export default function Navbar() {
  const { user, logout } = useMarket();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 8);
  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={cx(
      "fixed inset-x-0 top-0 z-50 border-b transition",
      scrolled || open ? "border-white/10 bg-[#060910]/92 backdrop-blur-xl" : "border-transparent bg-[#060910]/45 backdrop-blur-md",
    )}>
      <div className="shell flex h-16 items-center justify-between gap-3">
        <Logo compact onClick={close} />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => linkClass(isActive)} onClick={close}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <NavLink to="/portfolio" className="max-w-24 truncate text-sm font-semibold text-slate-200 sm:max-w-36">
                {user.name}
              </NavLink>
              <button type="button" className="btn btn-ghost hidden px-4 py-2 sm:inline-flex" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost hidden px-4 py-2 md:inline-flex" onClick={close}>Login</NavLink>
              <NavLink to="/signup" className="btn btn-gold px-4 py-2" onClick={close}>Sign up</NavLink>
            </>
          )}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex w-4 flex-col gap-1.5">
              <span className={cx("block h-0.5 w-full origin-center bg-white transition", open && "translate-y-2 rotate-45")} />
              <span className={cx("block h-0.5 w-full bg-white transition", open && "opacity-0")} />
              <span className={cx("block h-0.5 w-full origin-center bg-white transition", open && "-translate-y-2 -rotate-45")} />
            </span>
          </button>
        </div>
      </div>
      {open && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-white/10 bg-[#060910] lg:hidden">
          <nav className="shell flex flex-col gap-1 py-3" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => linkClass(isActive)} onClick={close}>
                {link.label}
              </NavLink>
            ))}
            {user ? (
              <button type="button" className="btn btn-ghost mt-2" onClick={() => { logout(); close(); }}>Log out</button>
            ) : (
              <NavLink to="/login" className="btn btn-ghost mt-2" onClick={close}>Login</NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
