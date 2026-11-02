import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MarketContext } from "./market-context";
import {
  DEFAULT_WATCHLIST,
  INITIAL_CASH,
  INITIAL_HOLDINGS,
  INITIAL_ORDERS,
  QUOTE_BOOK,
} from "../data/market";
import { buildMetrics } from "../lib/metrics";
import { applyOrder } from "../lib/orders";

const DESK_KEY = "aurix-desk-v1";
const WATCH_KEY = "aurix-watch-v1";

function loadDesk() {
  try {
    const raw = sessionStorage.getItem(DESK_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data.cash !== "number" || !Array.isArray(data.holdings) || !Array.isArray(data.orders)) {
      return null;
    }
    return {
      cash: data.cash,
      holdings: data.holdings,
      orders: data.orders,
      user: data.user ?? null,
    };
  } catch {
    return null;
  }
}

function loadWatchlist() {
  try {
    const raw = localStorage.getItem(WATCH_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
      return parsed.filter((symbol) => QUOTE_BOOK[symbol]);
    }
  } catch {
    /* keep the sample list */
  }
  return DEFAULT_WATCHLIST;
}

function freshDesk() {
  return {
    cash: INITIAL_CASH,
    holdings: INITIAL_HOLDINGS.map((holding) => ({ ...holding })),
    orders: INITIAL_ORDERS.map((order) => ({ ...order })),
    user: null,
  };
}

export function MarketProvider({ children }) {
  const [quotes, setQuotes] = useState(() => structuredClone(QUOTE_BOOK));
  const [watchlist, setWatchlist] = useState(loadWatchlist);
  const [desk, setDesk] = useState(() => loadDesk() ?? freshDesk());
  const deskRef = useRef(desk);
  useEffect(() => {
    deskRef.current = desk;
  }, [desk]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setQuotes((current) => {
        const symbols = Object.keys(current);
        const next = { ...current };
        const picks = 2;
        for (let step = 0; step < picks; step += 1) {
          const symbol = symbols[Math.floor(Math.random() * symbols.length)];
          const quote = next[symbol];
          const delta = quote.price * (Math.random() - 0.48) * 0.0013;
          const price = Math.max(0.01, +(quote.price + delta).toFixed(2));
          const change = +(((price - quote.prevClose) / quote.prevClose) * 100).toFixed(2);
          const spark = quote.spark.slice(1).concat(price);
          next[symbol] = {
            ...quote,
            price,
            change,
            spark,
            high: Math.max(quote.high, price),
            low: Math.min(quote.low, price),
          };
        }
        return next;
      });
    }, 1700);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    localStorage.setItem(WATCH_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    sessionStorage.setItem(DESK_KEY, JSON.stringify(desk));
  }, [desk]);

  const toggleWatch = useCallback((symbol) => {
    setWatchlist((current) => (
      current.includes(symbol) ? current.filter((item) => item !== symbol) : [...current, symbol]
    ));
  }, []);

  const placeOrder = useCallback((input) => {
    const result = applyOrder(deskRef.current, input);
    if (result.ok) setDesk(result.desk);
    return result;
  }, []);

  const login = useCallback((user) => {
    setDesk((current) => ({ ...current, user }));
  }, []);

  const logout = useCallback(() => {
    setDesk((current) => ({ ...current, user: null }));
  }, []);

  const resetDesk = useCallback(() => {
    setDesk((current) => ({ ...freshDesk(), user: current.user }));
  }, []);

  const value = useMemo(() => {
    const list = Object.values(quotes);
    const stocks = list.filter((item) => item.kind === "stock");
    const markets = list.filter((item) => item.kind !== "stock");
    const metrics = buildMetrics(desk.cash, desk.holdings, quotes);
    return {
      quotes,
      stocks,
      markets,
      watchlist,
      toggleWatch,
      isWatched: (symbol) => watchlist.includes(symbol),
      metrics,
      orders: desk.orders,
      user: desk.user,
      placeOrder,
      login,
      logout,
      resetDesk,
    };
  }, [quotes, watchlist, desk, toggleWatch, placeOrder, login, logout, resetDesk]);

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}
