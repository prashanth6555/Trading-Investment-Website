import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMarket } from "../hooks/useMarket";
import { formatDelta, formatQuote } from "../lib/format";
import { CandleChart } from "./Charts";
import { ChangeText, FlashValue } from "./Ui";

const venues = ["NYSE", "NASDAQ", "LSE", "NSE", "TSE", "HKEX"];

function useCount(target) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min(1, (now - start) / 1100);
      const eased = 1 - (1 - progress) ** 3;
      setValue(target * eased);
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return value;
}

export default function Hero() {
  const { stocks, user } = useMarket();
  const featured = [...stocks].sort((a, b) => (b.baseChange ?? b.change) - (a.baseChange ?? a.change))[0];
  const traders = useCount(2.4);
  const venuesCount = useCount(120);

  return (
    <section className="relative overflow-hidden">
      <img src="/images/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#060910]/35 via-[#060910]/80 to-[#060910]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#060910] via-[#060910]/75 to-[#060910]/25" />
      <div className="absolute inset-0 bg-grid" />
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />

      <div className="shell relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="rise">
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-300" />
            </span>
            Simulated desk · quotes tick live
          </p>
          <h1 className="mt-5 max-w-xl font-display text-[2.35rem] leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            Trade global markets from one precise desk.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Indices, trending names, portfolio analytics, and a buy or sell ticket that shows the total before you confirm. Built edge to edge for phone, tablet, and a full trading screen.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to={user ? "/trade" : "/signup"} className="btn btn-gold">{user ? "Open the ticket" : "Start trading"}</Link>
            <Link to="/markets" className="btn btn-ghost">Explore markets</Link>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Venues</dt>
              <dd className="mt-1 font-display text-2xl text-white sm:text-3xl">{Math.round(venuesCount)}+</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Investors</dt>
              <dd className="mt-1 font-display text-2xl text-white sm:text-3xl">{traders.toFixed(1)}M</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Confirm</dt>
              <dd className="mt-1 font-display text-2xl text-white sm:text-3xl">2 steps</dd>
            </div>
          </dl>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            {venues.map((venue) => <li key={venue}>{venue}</li>)}
          </ul>
        </div>

        {featured && (
          <div className="rise animate-floaty rounded-[1.6rem] border border-white/15 bg-[#0c1322]/80 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Leading mover</p>
                <h2 className="font-display text-2xl text-white">{featured.symbol}</h2>
                <p className="text-sm text-slate-400">{featured.name}</p>
              </div>
              <div className="text-right">
                <FlashValue value={featured.price} className="font-display text-3xl text-white">
                  {formatQuote(featured)}
                </FlashValue>
                <p className="mt-1 text-sm">
                  <span className="text-slate-300">{formatDelta(featured)}</span>{" "}
                  <ChangeText value={featured.change} />
                </p>
              </div>
            </div>
            <CandleChart series={featured.spark} className="mt-3 h-40 w-full sm:h-48" />
            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-white/5 px-2 py-2">
                <p className="text-slate-400">Open</p>
                <p className="mt-1 font-semibold text-white tabular-nums">{formatQuote({ ...featured, price: featured.prevClose })}</p>
              </div>
              <div className="rounded-xl bg-white/5 px-2 py-2">
                <p className="text-slate-400">High</p>
                <p className="mt-1 font-semibold text-white tabular-nums">{formatQuote({ ...featured, price: featured.high })}</p>
              </div>
              <div className="rounded-xl bg-white/5 px-2 py-2">
                <p className="text-slate-400">Low</p>
                <p className="mt-1 font-semibold text-white tabular-nums">{formatQuote({ ...featured, price: featured.low })}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link to={`/trade?symbol=${featured.symbol}&side=buy`} className="btn btn-buy">Buy {featured.symbol}</Link>
              <Link to={`/trade?symbol=${featured.symbol}&side=sell`} className="btn btn-sell">Sell {featured.symbol}</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
