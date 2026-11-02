import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { cx, formatMoney, toneClass } from "../lib/format";

export function Logo({ compact = false, onClick }) {
  return (
    <Link to="/" onClick={onClick} className="inline-flex items-center gap-2.5 text-white">
      <svg viewBox="0 0 36 36" className="h-9 w-9 shrink-0" aria-hidden="true">
        <rect width="36" height="36" rx="11" fill="#E4B15A" />
        <path d="M8 25.5 14.2 16.5l4.6 3.4L28 9" fill="none" stroke="#1A1204" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21.5 9H28v6.5" fill="none" stroke="#1A1204" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-xl tracking-tight">Aurix</span>
        {!compact && <span className="block text-[10px] uppercase tracking-[0.18em] text-slate-400">Markets</span>}
      </span>
    </Link>
  );
}

export function Mark({ symbol, size = "md" }) {
  const palette = ["#e4b15a", "#7ec8ff", "#3ddc97", "#c4b5fd", "#fb7185", "#67e8f9", "#fdba74", "#f9a8d4"];
  let hash = 0;
  for (let index = 0; index < symbol.length; index += 1) hash = (hash * 33 + symbol.charCodeAt(index)) >>> 0;
  const background = palette[hash % palette.length];
  const dim = size === "sm" ? "h-8 w-8 text-[10px]" : "h-11 w-11 text-xs";
  return (
    <span className={cx("grid shrink-0 place-items-center rounded-xl font-bold text-[#0b1020]", dim)} style={{ background }}>
      {symbol.slice(0, 2)}
    </span>
  );
}

export function Status({ phase = "Closed", open = false }) {
  const live = open || phase === "Open";
  return (
    <span className={cx(
      "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
      live ? "bg-emerald-400/10 text-emerald-300" : "bg-white/5 text-slate-400",
    )}>
      <span className="relative flex h-1.5 w-1.5">
        {live && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70" />}
        <span className={cx("relative h-1.5 w-1.5 rounded-full", live ? "bg-emerald-300" : "bg-slate-500")} />
      </span>
      {phase}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, text, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-300">{eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl text-white sm:text-4xl">{title}</h2>
        {text && <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHero({ eyebrow, title, text, children }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-grid" />
      <img src="/images/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#060910] via-[#060910]/88 to-[#060910]/70" />
      <div className="shell relative py-10 sm:py-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-300">{eyebrow}</p>
        <h1 className="mt-2 max-w-4xl font-display text-4xl leading-tight text-white sm:text-5xl">{title}</h1>
        {text && <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">{text}</p>}
        {children}
      </div>
    </section>
  );
}

export function Modal({ open, title, onClose, children }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4">
      <button type="button" className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-label="Close dialog" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-[#0d1424] p-5 shadow-2xl outline-none sm:max-w-xl sm:rounded-3xl sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl text-white">{title}</h3>
          <button type="button" className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300 hover:text-white" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function FlashValue({ value, className = "", children }) {
  const previous = useRef(value);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (value > previous.current) setDirection(1);
    else if (value < previous.current) setDirection(-1);
    previous.current = value;
    const timer = window.setTimeout(() => setDirection(0), 700);
    return () => window.clearTimeout(timer);
  }, [value]);

  const flash = direction > 0 ? "bg-emerald-400/15" : direction < 0 ? "bg-rose-400/15" : "bg-transparent";
  return <span className={cx("rounded-md px-1 tabular-nums transition-colors duration-500", flash, className)}>{children}</span>;
}

export function Money({ value, signed = false, className = "" }) {
  const text = signed
    ? `${value > 0 ? "+" : value < 0 ? "-" : ""}${formatMoney(Math.abs(value || 0))}`
    : formatMoney(value);
  return <span className={cx("tabular-nums", signed && toneClass(value), className)}>{text}</span>;
}

export function ChangeText({ value, className = "" }) {
  const sign = value > 0 ? "+" : "";
  return <span className={cx("tabular-nums font-semibold", toneClass(value), className)}>{sign}{Number(value || 0).toFixed(2)}%</span>;
}
