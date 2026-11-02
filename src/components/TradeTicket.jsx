import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMarket } from "../hooks/useMarket";
import { formatMoney, formatQuote } from "../lib/format";
import { ChangeText, Modal, SectionHeading } from "./Ui";

const presets = [1, 5, 10, 25];

export default function TradeTicket({ framed = true }) {
  const { stocks, quotes, metrics, placeOrder, orders } = useMarket();
  const [params] = useSearchParams();
  const requestedSymbol = params.get("symbol") || "";
  const requestedSide = params.get("side") === "sell" ? "sell" : params.get("side") === "buy" ? "buy" : "";
  const requestKey = `${requestedSymbol}|${requestedSide}`;
  const [draft, setDraft] = useState(null);
  const symbol = draft?.key === requestKey && draft.symbol ? draft.symbol : (requestedSymbol || "AAPL");
  const side = draft?.key === requestKey && draft.side ? draft.side : (requestedSide || "buy");
  const [type, setType] = useState("market");
  const [qty, setQty] = useState("1");
  const [limit, setLimit] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [frozen, setFrozen] = useState(null);
  const [filled, setFilled] = useState(null);
  const [open, setOpen] = useState(false);
  const lock = useRef(false);
  const quote = quotes[symbol];
  const held = metrics.rows.find((row) => row.symbol === symbol);
  const quantity = Number(qty);
  const workingPrice = type === "market" ? quote?.price : Number(limit);
  const validPrice = Number.isFinite(workingPrice) && workingPrice > 0;
  const estimated = Number.isInteger(quantity) && quantity > 0 && validPrice ? quantity * workingPrice : 0;
  const afterCash = side === "buy" ? metrics.cash - estimated : metrics.cash + estimated;

  const choices = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = stocks.filter((stock) => `${stock.symbol} ${stock.name}`.toLowerCase().includes(needle));
    if (needle) return filtered;
    const selected = filtered.find((stock) => stock.symbol === symbol);
    const rest = filtered.filter((stock) => stock.symbol !== symbol).slice(0, 7);
    return selected ? [selected, ...rest] : filtered.slice(0, 8);
  }, [stocks, query, symbol]);

  const review = (event) => {
    event.preventDefault();
    setError("");
    if (!quote) {
      setError("Choose a listed symbol.");
      return;
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      setError("Enter a whole number of shares.");
      return;
    }
    if (!validPrice) {
      setError("Enter a valid limit price.");
      return;
    }
    if (side === "buy" && metrics.cash + 1e-6 < estimated) {
      setError("Not enough buying power for this order.");
      return;
    }
    if (side === "sell" && (!held || held.shares < quantity)) {
      setError("You do not hold enough shares to sell.");
      return;
    }
    setFrozen(+workingPrice.toFixed(2));
    setFilled(null);
    setOpen(true);
  };

  const confirm = () => {
    if (lock.current) return;
    lock.current = true;
    const result = placeOrder({ side, symbol, qty: quantity, price: frozen, type });
    if (!result.ok) {
      lock.current = false;
      setError(result.error);
      return;
    }
    setFilled(result.order);
    setError("");
  };

  const close = () => {
    lock.current = false;
    setOpen(false);
    setFilled(null);
    setError("");
  };

  const ticket = (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="panel p-4">
        <label className="text-sm font-semibold text-white" htmlFor="symbol-search">Choose a symbol</label>
        <input id="symbol-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter the book" className="field mt-3" />
        <ul className="mt-3 max-h-[28rem] space-y-2 overflow-y-auto pr-1">
          {choices.map((stock) => (
            <li key={stock.symbol}>
              <button
                type="button"
                onClick={() => {
                  setDraft({ key: requestKey, symbol: stock.symbol, side });
                  setError("");
                }}
                className={stock.symbol === symbol
                  ? "flex w-full items-center justify-between rounded-xl border border-amber-300/50 bg-amber-300/10 px-3 py-2 text-left"
                  : "flex w-full items-center justify-between rounded-xl border border-white/8 px-3 py-2 text-left hover:border-white/20"}
              >
                <span>
                  <span className="block font-semibold text-white">{stock.symbol}</span>
                  <span className="block text-xs text-slate-400">{stock.name}</span>
                </span>
                <span className="text-right">
                  <span className="block text-sm text-white tabular-nums">{formatQuote(stock)}</span>
                  <ChangeText value={stock.change} className="text-xs" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <form className="panel p-4 sm:p-5" onSubmit={review}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{quote?.exchange || "Ticket"}</p>
            <h3 className="font-display text-3xl text-white">{quote ? quote.symbol : "—"}</h3>
            <p className="text-sm text-slate-400">{quote?.name} · {quote ? formatQuote(quote) : "Select a symbol"}</p>
          </div>
          <p className="text-sm text-slate-300">Buying power <span className="font-semibold text-white">{formatMoney(metrics.cash)}</span></p>
        </div>
        {quote?.blurb && <p className="mt-3 text-sm leading-6 text-slate-400">{quote.blurb}</p>}

        <div className="mt-5 grid grid-cols-2 gap-2">
          {["buy", "sell"].map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={side === item}
              onClick={() => setDraft({ key: requestKey, symbol, side: item })}
              className={side === item ? (item === "buy" ? "btn btn-buy" : "btn btn-sell") : "btn btn-ghost"}
            >
              {item === "buy" ? "Buy" : "Sell"}
            </button>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {["market", "limit"].map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={type === item}
              onClick={() => {
                setType(item);
                if (item === "limit" && quote) setLimit(quote.price.toFixed(2));
              }}
              className={type === item ? "rounded-xl bg-white/10 py-2 text-sm font-semibold text-white" : "rounded-xl border border-white/10 py-2 text-sm text-slate-300"}
            >
              {item === "market" ? "Market" : "Limit"}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm text-slate-300">
            Quantity
            <input
              className="field mt-1.5"
              inputMode="numeric"
              min="1"
              step="1"
              value={qty}
              onChange={(event) => setQty(event.target.value.replace(/[^\d]/g, ""))}
            />
          </label>
          <label className="block text-sm text-slate-300">
            {type === "market" ? "Market price" : "Limit price"}
            <input
              className="field mt-1.5"
              inputMode="decimal"
              value={type === "market" ? (quote ? quote.price.toFixed(2) : "") : limit}
              readOnly={type === "market"}
              onChange={(event) => setLimit(event.target.value)}
            />
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button key={preset} type="button" className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-200 hover:border-amber-300/50" onClick={() => setQty(String(preset))}>
              {preset} sh
            </button>
          ))}
          <span className="self-center text-xs text-slate-500">
            {held ? `${held.shares} shares held` : "No position"}
          </span>
        </div>

        <dl className="mt-5 space-y-2 rounded-2xl border border-white/8 bg-black/20 p-4 text-sm">
          <div className="flex justify-between gap-3"><dt className="text-slate-400">Side</dt><dd className="font-semibold capitalize text-white">{side} · {type}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-slate-400">Estimated total</dt><dd className="font-semibold text-white tabular-nums">{estimated ? formatMoney(estimated) : "—"}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-slate-400">Fees</dt><dd className="text-white">$0.00 demo</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-slate-400">Cash after fill</dt><dd className="font-semibold text-white tabular-nums">{estimated ? formatMoney(afterCash) : formatMoney(metrics.cash)}</dd></div>
        </dl>
        {error && !open && <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p>}
        <button type="submit" className="btn btn-gold mt-4 w-full">Review {side} order</button>
        <p className="mt-3 text-xs leading-5 text-slate-500">Market orders freeze the price shown when you review. This fill stays on this browser only.</p>
      </form>
    </div>
  );

  const activity = (
    <div className="panel mt-4 p-4">
      <h3 className="font-display text-xl text-white">Recent orders</h3>
      <ul className="mt-3 divide-y divide-white/8">
        {orders.slice(0, 5).map((order) => (
          <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
            <span className="font-semibold text-white">{order.side === "buy" ? "Bought" : "Sold"} {order.qty} {order.symbol}</span>
            <span className="text-slate-400">{formatMoney(order.price)} · {order.time}</span>
            <span className="text-xs text-slate-500">{order.id}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const dialog = (
    <Modal open={open} title={filled ? "Order filled" : "Confirm order"} onClose={close}>
      {filled ? (
        <div className="text-center">
          <svg viewBox="0 0 52 52" className="mx-auto h-16 w-16" aria-hidden="true">
            <circle cx="26" cy="26" r="23" fill="none" stroke="#3ddc97" strokeWidth="2" />
            <path className="draw-check" d="M15 27.5 22 34.5 37 18" fill="none" stroke="#3ddc97" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="mt-4 font-display text-2xl text-white" role="status">{filled.side === "buy" ? "Bought" : "Sold"} {filled.qty} {filled.symbol}</p>
          <p className="mt-2 text-sm text-slate-400">Fill {formatMoney(filled.price)} · total {formatMoney(filled.notion)} · {filled.id}</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link to="/portfolio" className="btn btn-gold" onClick={close}>View portfolio</Link>
            <button type="button" className="btn btn-ghost" onClick={close}>Place another</button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm leading-6 text-slate-300">
            {side === "buy" ? "Buy" : "Sell"} <strong className="text-white">{quantity || 0} {symbol}</strong> at{" "}
            <strong className="text-white">{frozen ? formatMoney(frozen) : "—"}</strong> ({type}). Estimated total{" "}
            <strong className="text-white">{frozen ? formatMoney(quantity * frozen) : "—"}</strong>.
          </p>
          <p className="mt-2 text-sm text-slate-400">Cash after this fill: {frozen ? formatMoney(side === "buy" ? metrics.cash - quantity * frozen : metrics.cash + quantity * frozen) : "—"}.</p>
          {error && <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p>}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button type="button" className="btn btn-ghost" onClick={close}>Edit</button>
            <button type="button" className={side === "buy" ? "btn btn-buy" : "btn btn-sell"} onClick={confirm}>
              Confirm {side}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );

  if (!framed) {
    return (
      <div>
        {ticket}
        {activity}
        {dialog}
      </div>
    );
  }

  return (
    <section className="border-t border-white/8 py-14 sm:py-16">
      <div className="shell">
        <SectionHeading
          eyebrow="Trading"
          title="Review the order before it hits the book."
          text="Set a quantity, choose market or limit, and confirm. The portfolio and cash balance update immediately."
          action={<Link to="/trade" className="btn btn-ghost">Full ticket</Link>}
        />
        {ticket}
        {activity}
        {dialog}
      </div>
    </section>
  );
}
