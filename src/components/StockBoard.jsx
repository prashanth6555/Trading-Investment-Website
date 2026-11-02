import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMarket } from "../hooks/useMarket";
import { formatQuote } from "../lib/format";
import { Sparkline } from "./Charts";
import { ChangeText, FlashValue, Mark, SectionHeading } from "./Ui";

const sorts = [
  { id: "trending", label: "Trending" },
  { id: "gainers", label: "Gainers" },
  { id: "losers", label: "Losers" },
  { id: "price", label: "Price" },
  { id: "name", label: "Name" },
];

function sortStocks(list, sort) {
  const next = [...list];
  const move = (stock) => stock.baseChange ?? stock.change;
  if (sort === "gainers") next.sort((a, b) => move(b) - move(a));
  else if (sort === "losers") next.sort((a, b) => move(a) - move(b));
  else if (sort === "price") next.sort((a, b) => b.price - a.price);
  else if (sort === "name") next.sort((a, b) => a.name.localeCompare(b.name));
  else next.sort((a, b) => Math.abs(move(b)) - Math.abs(move(a)));
  return next;
}

function StockActions({ symbol }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Link to={`/trade?symbol=${symbol}&side=buy`} className="btn btn-buy px-3 py-2 text-sm">Buy</Link>
      <Link to={`/trade?symbol=${symbol}&side=sell`} className="btn btn-sell px-3 py-2 text-sm">Sell</Link>
    </div>
  );
}

function StockCard({ stock, watched, onWatch }) {
  return (
    <article className="panel card-hover flex h-full flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Mark symbol={stock.symbol} />
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-white">{stock.name}</h3>
            <p className="text-xs text-slate-400">{stock.symbol} · {stock.sector}</p>
          </div>
        </div>
        <button
          type="button"
          aria-pressed={watched}
          aria-label={watched ? `Remove ${stock.symbol} from watchlist` : `Add ${stock.symbol} to watchlist`}
          onClick={() => onWatch(stock.symbol)}
          className={watched ? "text-amber-300" : "text-slate-500 hover:text-amber-200"}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill={watched ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.8 6.6 19.8l1-6.1L3.2 9.4l6.1-.9L12 3z" />
          </svg>
        </button>
      </div>
      <Sparkline data={stock.spark} positive={stock.change >= 0} className="mt-4 h-12 w-full" />
      <div className="mt-3 flex items-end justify-between">
        <FlashValue value={stock.price} className="font-display text-2xl text-white">{formatQuote(stock)}</FlashValue>
        <ChangeText value={stock.change} />
      </div>
      <p className="mt-2 text-xs text-slate-500">Vol {stock.volume} · Mkt cap {stock.marketCap}</p>
      <div className="mt-4"><StockActions symbol={stock.symbol} /></div>
    </article>
  );
}

export default function StockBoard({ variant = "preview" }) {
  const { stocks, isWatched, toggleWatch } = useMarket();
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("All");
  const [sort, setSort] = useState("trending");
  const sectors = ["All", ...new Set(stocks.map((stock) => stock.sector))];

  const visible = useMemo(() => {
    const filtered = stocks.filter((stock) => {
      const haystack = `${stock.symbol} ${stock.name}`.toLowerCase();
      const matchesQuery = haystack.includes(query.trim().toLowerCase());
      const matchesSector = sector === "All" || stock.sector === sector;
      return matchesQuery && matchesSector;
    });
    return sortStocks(filtered, sort);
  }, [stocks, query, sector, sort]);

  const preview = sortStocks(stocks, "trending").slice(0, 8);
  const gainers = sortStocks(stocks, "gainers").slice(0, 3);
  const losers = sortStocks(stocks, "losers").slice(0, 3);

  if (variant === "preview") {
    return (
      <section className="py-14 sm:py-16">
        <div className="shell">
          <SectionHeading
            eyebrow="Stock market"
            title="Names the tape is arguing about."
            text="Company, last price, and the day's move. Buy and sell jump straight into the ticket."
            action={<Link to="/stocks" className="btn btn-ghost">Browse stocks</Link>}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {preview.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} watched={isWatched(stock.symbol)} onWatch={toggleWatch} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-12">
      <div className="shell">
        <div className="grid gap-3 lg:grid-cols-2">
          <MoverList title="Top gainers" items={gainers} />
          <MoverList title="Top losers" items={losers} />
        </div>

        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full lg:max-w-sm">
            <span className="sr-only">Search stocks</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search symbol or company"
              className="field pl-10"
            />
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">⌕</span>
          </label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {sorts.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={sort === item.id}
                onClick={() => setSort(item.id)}
                className={sort === item.id ? "btn btn-gold px-4 py-2" : "btn btn-ghost px-4 py-2"}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
          {sectors.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={sector === item}
              onClick={() => setSector(item)}
              className={sector === item
                ? "rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-[#1a1204]"
                : "rounded-full border border-white/10 px-3 py-1.5 text-sm text-slate-300"}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:hidden">
          {visible.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} watched={isWatched(stock.symbol)} onWatch={toggleWatch} />
          ))}
        </div>

        <div className="panel mt-5 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-slate-400">
              <tr className="border-b border-white/10">
                {["Company", "Price", "Change", "Volume", "Mkt cap", "P/E", ""].map((heading) => (
                  <th key={heading || "actions"} className="px-4 py-3 font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((stock) => (
                <tr key={stock.symbol} className="border-b border-white/5 transition hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Mark symbol={stock.symbol} size="sm" />
                      <div>
                        <p className="font-semibold text-white">{stock.name}</p>
                        <p className="text-xs text-slate-400">{stock.symbol} · {stock.sector}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-white"><FlashValue value={stock.price}>{formatQuote(stock)}</FlashValue></td>
                  <td className="px-4 py-3"><ChangeText value={stock.change} /></td>
                  <td className="px-4 py-3 text-slate-300">{stock.volume}</td>
                  <td className="px-4 py-3 text-slate-300">{stock.marketCap}</td>
                  <td className="px-4 py-3 text-slate-300">{stock.pe}</td>
                  <td className="px-4 py-3"><div className="w-36"><StockActions symbol={stock.symbol} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visible.length === 0 && <p className="mt-6 text-slate-400">No symbols match that filter.</p>}
      </div>
    </section>
  );
}

function MoverList({ title, items }) {
  return (
    <div className="panel p-4">
      <h2 className="font-display text-xl text-white">{title}</h2>
      <ul className="mt-3 divide-y divide-white/8">
        {items.map((stock) => (
          <li key={stock.symbol} className="flex items-center justify-between gap-3 py-2.5">
            <div className="flex min-w-0 items-center gap-3">
              <Mark symbol={stock.symbol} size="sm" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">{stock.symbol}</p>
                <p className="truncate text-xs text-slate-400">{stock.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white tabular-nums">{formatQuote(stock)}</p>
              <ChangeText value={stock.change} className="text-xs" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
