import { SECTOR_COLORS } from "../data/market";

export function buildMetrics(cash, holdings, quotes) {
  let marketValue = 0;
  let invested = 0;
  let today = 0;

  const rows = holdings.map((holding) => {
    const quote = quotes[holding.symbol];
    const price = quote?.price ?? holding.avg;
    const prev = quote?.prevClose ?? price;
    const value = price * holding.shares;
    const cost = holding.avg * holding.shares;
    const day = (price - prev) * holding.shares;
    marketValue += value;
    invested += cost;
    today += day;
    return {
      ...holding,
      name: quote?.name ?? holding.symbol,
      sector: quote?.sector ?? "Other",
      price,
      value,
      pnl: value - cost,
      pnlPct: cost ? ((value - cost) / cost) * 100 : 0,
      day,
      dayPct: quote?.change ?? 0,
      spark: quote?.spark ?? [],
    };
  });

  const buckets = new Map();
  rows.forEach((row) => {
    buckets.set(row.sector, (buckets.get(row.sector) || 0) + row.value);
  });
  if (cash > 0) buckets.set("Cash", (buckets.get("Cash") || 0) + cash);

  const allocation = [...buckets.entries()]
    .map(([label, value]) => ({
      label,
      value,
      color: SECTOR_COLORS[label] || "#94a3b8",
    }))
    .sort((a, b) => b.value - a.value);

  const total = cash + marketValue;
  const pnl = marketValue - invested;
  const base = marketValue - today;

  return {
    rows,
    cash,
    marketValue,
    invested,
    total,
    pnl,
    pnlPct: invested ? (pnl / invested) * 100 : 0,
    today,
    todayPct: base ? (today / base) * 100 : 0,
    allocation,
  };
}
