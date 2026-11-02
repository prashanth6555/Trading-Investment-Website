import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMarket } from "../hooks/useMarket";
import { formatQuote } from "../lib/format";
import { Sparkline } from "./Charts";
import { ChangeText, FlashValue, Mark, SectionHeading } from "./Ui";

export default function WatchlistPanel({ detailed = false }) {
  const { stocks, quotes, watchlist, toggleWatch, isWatched } = useMarket();
  const [query, setQuery] = useState("");
  const items = watchlist.map((symbol) => quotes[symbol]).filter(Boolean);
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return stocks
      .filter((stock) => `${stock.symbol} ${stock.name}`.toLowerCase().includes(needle))
      .slice(0, needle ? 6 : 4);
  }, [stocks, query]);

  return (
    <section className={detailed ? "py-10 sm:py-12" : "py-14 sm:py-16"}>
      <div className="shell">
        <SectionHeading
          eyebrow="Watchlist"
          title="Keep the names you care about in one row."
          text="Add or remove symbols. Prices and percentage moves update with the same tape as the rest of the desk."
          action={detailed ? null : <Link to="/watchlist" className="btn btn-ghost">Manage list</Link>}
        />
        <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
          <div className="panel h-fit p-4">
            <label className="block text-sm font-semibold text-white" htmlFor="watch-search">Add a stock</label>
            <input
              id="watch-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search AAPL, Tesla..."
              className="field mt-3"
            />
            <ul className="mt-3 space-y-2">
              {matches.map((stock) => {
                const saved = isWatched(stock.symbol);
                return (
                  <li key={stock.symbol}>
                    <button
                      type="button"
                      onClick={() => toggleWatch(stock.symbol)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/8 px-3 py-2 text-left transition hover:border-amber-300/40"
                    >
                      <span className="min-w-0">
                        <span className="block font-semibold text-white">{stock.symbol}</span>
                        <span className="block truncate text-xs text-slate-400">{stock.name}</span>
                      </span>
                      <span className={saved ? "text-xs font-bold text-rose-300" : "text-xs font-bold text-amber-200"}>
                        {saved ? "Remove" : "Add"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {items.length === 0 ? (
            <div className="panel grid min-h-48 place-items-center p-6 text-center text-slate-400">
              Your watchlist is empty. Add a symbol to start a card.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((stock) => (
                <article key={stock.symbol} className="panel card-hover p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Mark symbol={stock.symbol} />
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-white">{stock.name}</h3>
                        <p className="text-xs text-slate-400">{stock.symbol} · {stock.sector}</p>
                      </div>
                    </div>
                    <button type="button" className="text-xs font-bold text-rose-300" onClick={() => toggleWatch(stock.symbol)}>
                      Remove
                    </button>
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <FlashValue value={stock.price} className="font-display text-2xl text-white">{formatQuote(stock)}</FlashValue>
                      <p className="mt-1"><ChangeText value={stock.change} /></p>
                    </div>
                    <Sparkline data={stock.spark} positive={stock.change >= 0} className="h-12 w-28" />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link to={`/trade?symbol=${stock.symbol}&side=buy`} className="btn btn-buy py-2 text-sm">Buy</Link>
                    <Link to={`/trade?symbol=${stock.symbol}&side=sell`} className="btn btn-sell py-2 text-sm">Sell</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
