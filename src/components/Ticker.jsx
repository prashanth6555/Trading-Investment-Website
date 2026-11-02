import { useMarket } from "../hooks/useMarket";
import { formatPct, formatQuote, toneClass } from "../lib/format";

export default function Ticker() {
  const { markets, stocks } = useMarket();
  const rows = [...markets, ...stocks];
  const loop = [...rows, ...rows];

  return (
    <div className="ticker relative overflow-hidden border-y border-white/10 bg-[#080d18]">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center bg-gradient-to-r from-[#080d18] from-55% to-transparent pr-10 pl-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">Live</span>
      </div>
      <div className="flex w-max animate-marquee py-2.5" aria-hidden="true">
        {loop.map((quote, index) => (
          <span key={`${quote.symbol}-${index}`} className="mx-4 inline-flex items-center gap-2 text-sm">
            <span className="font-semibold text-white">{quote.symbol}</span>
            <span className="text-slate-300 tabular-nums">{formatQuote(quote)}</span>
            <span className={toneClass(quote.change)}>{formatPct(quote.change)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
