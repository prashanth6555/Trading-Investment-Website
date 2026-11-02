import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SESSIONS } from "../data/market";
import { useMarket } from "../hooks/useMarket";
import { formatClockMinutes, formatDelta, formatQuote, sessionState } from "../lib/format";
import { Sparkline } from "./Charts";
import { ChangeText, FlashValue, SectionHeading, Status } from "./Ui";

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function statusFor(quote, now) {
  if (quote.session === "24H") return { open: true, phase: "Open", clock: "24 hour market" };
  const session = SESSIONS.find((item) => item.id === quote.session);
  return session ? sessionState(now, session) : { open: false, phase: "Closed", clock: "—" };
}

export function SessionClocks({ large = false }) {
  const now = useClock();
  return (
    <div className={large ? "grid gap-3 sm:grid-cols-2 xl:grid-cols-4" : "mb-5 flex gap-2 overflow-x-auto no-scrollbar"}>
      {SESSIONS.map((session) => {
        const state = sessionState(now, session);
        return (
          <article key={session.id} className={large ? "panel p-4" : "min-w-[11.5rem] rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2"}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg text-white">{session.label}</h3>
              <Status phase={state.phase} open={state.open} />
            </div>
            <p className={large ? "mt-3 font-display text-3xl text-white" : "mt-1 font-semibold text-white"}>{state.clock}</p>
            <p className="text-xs text-slate-400">
              {formatClockMinutes(session.open)} – {formatClockMinutes(session.close)}
            </p>
          </article>
        );
      })}
    </div>
  );
}

export function IndexGrid() {
  const { markets } = useMarket();
  const now = useClock();

  return (
    <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 xl:grid-cols-4">
      {markets.map((quote, index) => {
        const state = statusFor(quote, now);
        return (
          <article key={quote.symbol} className="panel card-hover rise p-4" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">{quote.region}</p>
                <h3 className="truncate font-display text-xl text-white">{quote.name}</h3>
                <p className="text-xs text-slate-500">{quote.symbol} · {quote.meta}</p>
              </div>
              <Status phase={state.phase} open={state.open} />
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <FlashValue value={quote.price} className="font-display text-2xl text-white">
                  {formatQuote(quote)}
                </FlashValue>
                <p className="mt-1 text-sm">
                  <span className="text-slate-300">{formatDelta(quote)}</span>{" "}
                  <ChangeText value={quote.change} />
                </p>
              </div>
              <Sparkline data={quote.spark} positive={quote.change >= 0} className="h-12 w-28" />
            </div>
            <p className="mt-3 text-xs text-slate-500">{state.clock}</p>
          </article>
        );
      })}
    </div>
  );
}

export default function MarketOverview() {
  return (
    <section className="border-b border-white/8 py-14 sm:py-16">
      <div className="shell">
        <SectionHeading
          eyebrow="Market overview"
          title="Major indices, live on the tape."
          text="Price, percentage change, and session status for the benchmarks that set the tone. Quotes move on a simulated stream."
          action={<Link to="/markets" className="btn btn-ghost">All markets</Link>}
        />
        <SessionClocks />
        <IndexGrid />
      </div>
    </section>
  );
}
