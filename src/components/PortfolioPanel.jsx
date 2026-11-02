import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BENCHMARK, PERFORMANCE, RANGE_LABELS } from "../data/market";
import { useMarket } from "../hooks/useMarket";
import { formatMoney, formatPct } from "../lib/format";
import { AreaChart, Donut, Sparkline } from "./Charts";
import { ChangeText, Mark, Money, SectionHeading } from "./Ui";

const ranges = ["1D", "1W", "1M", "1Y"];

function scaleTo(series, end) {
  const last = series[series.length - 1] || 1;
  if (!last) return series.map(() => 0);
  return series.map((value) => (value / last) * end);
}

function greeting(name) {
  const hour = new Date().getHours();
  const part = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return name ? `${part}, ${name.split(" ")[0]}` : part;
}

export default function PortfolioPanel({ detailed = false }) {
  const { metrics, user, resetDesk } = useMarket();
  const [range, setRange] = useState("1M");
  const series = useMemo(() => scaleTo(PERFORMANCE[range], Math.max(metrics.total, 1)), [range, metrics.total]);
  const compare = useMemo(() => scaleTo(BENCHMARK[range], Math.max(metrics.total * 0.94, 1)), [range, metrics.total]);
  const labels = series.map((_, index) => {
    const marks = RANGE_LABELS[range];
    const slot = Math.round((index / Math.max(series.length - 1, 1)) * (marks.length - 1));
    return marks[slot];
  });

  const stats = [
    { label: "Total value", value: metrics.total, signed: false, hint: "Cash plus positions" },
    { label: "Profit / loss", value: metrics.pnl, signed: true, hint: formatPct(metrics.pnlPct) },
    { label: "Today", value: metrics.today, signed: true, hint: formatPct(metrics.todayPct) },
    { label: "Buying power", value: metrics.cash, signed: false, hint: "Available cash" },
  ];

  return (
    <section className={detailed ? "py-10 sm:py-12" : "border-y border-white/8 bg-white/[0.015] py-14 sm:py-16"}>
      <div className="shell">
        {!detailed && (
          <SectionHeading
            eyebrow="Portfolio"
            title={greeting(user?.name)}
            text="A sample book you can actually trade. Buys spend cash, sells return it, and the chart rescales to the new total."
            action={<Link to="/portfolio" className="btn btn-ghost">Open dashboard</Link>}
          />
        )}
        {detailed && (
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-300">Holdings</p>
              <h2 className="mt-2 font-display text-3xl text-white">{greeting(user?.name)}</h2>
            </div>
            <button type="button" className="btn btn-ghost" onClick={resetDesk}>Reset demo book</button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <article key={stat.label} className="panel p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{stat.label}</p>
              <p className="mt-2 font-display text-3xl text-white">
                <Money value={stat.value} signed={stat.signed} />
              </p>
              <p className="mt-1 text-sm text-slate-400">{stat.hint}</p>
            </article>
          ))}
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1.45fr_0.75fr]">
          <article className="panel p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-xl text-white">Performance</h3>
                <p className="text-xs text-slate-400">Portfolio path versus a quieter balanced index. Drag across the chart.</p>
              </div>
              <div className="flex gap-1">
                {ranges.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={range === item}
                    onClick={() => setRange(item)}
                    className={range === item ? "rounded-full bg-amber-300 px-3 py-1.5 text-xs font-bold text-[#1a1204]" : "rounded-full px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/5"}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <AreaChart points={series} compare={compare} labels={labels} positive={metrics.today >= 0} animateKey={range} />
            <div className="mt-1 flex justify-between text-[11px] text-slate-500">
              {RANGE_LABELS[range].map((label) => <span key={label}>{label}</span>)}
            </div>
            <div className="mt-3 flex gap-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-2"><i className="h-0.5 w-4" style={{ background: metrics.today >= 0 ? "#3ddc97" : "#ff5c7a" }} /> Portfolio</span>
              <span className="inline-flex items-center gap-2"><i className="h-0.5 w-4 border-t border-dashed border-white/50" /> Balanced index</span>
            </div>
          </article>

          <article className="panel p-4 sm:p-5">
            <h3 className="font-display text-xl text-white">Allocation</h3>
            <div className="mt-4 flex justify-center"><Donut slices={metrics.allocation} /></div>
            <ul className="mt-4 space-y-2">
              {metrics.allocation.map((slice) => (
                <li key={slice.label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="inline-flex items-center gap-2 text-slate-200">
                    <i className="h-2.5 w-2.5 rounded-full" style={{ background: slice.color }} />
                    {slice.label}
                  </span>
                  <span className="tabular-nums text-slate-400">
                    {metrics.total ? `${((slice.value / metrics.total) * 100).toFixed(1)}%` : "—"}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <article className="panel mt-4 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-xl text-white">Holdings</h3>
            <Link to="/trade" className="text-sm font-semibold text-amber-200">Trade</Link>
          </div>
          {metrics.rows.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">No positions yet. Buy shares from the ticket and they will land here.</p>
          ) : (
            <>
              <div className="mt-4 space-y-3 md:hidden">
                {metrics.rows.map((row) => (
                  <div key={row.symbol} className="rounded-2xl border border-white/8 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Mark symbol={row.symbol} size="sm" />
                        <div>
                          <p className="font-semibold text-white">{row.symbol}</p>
                          <p className="text-xs text-slate-400">{row.shares} shares · avg {formatMoney(row.avg)}</p>
                        </div>
                      </div>
                      <Sparkline data={row.spark} positive={row.day >= 0} />
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-slate-400">Value</p>
                        <p className="font-semibold text-white">{formatMoney(row.value)}</p>
                      </div>
                      <div className="text-right">
                        <Money value={row.pnl} signed />
                        <p><ChangeText value={row.dayPct} className="text-xs" /></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 hidden overflow-x-auto md:block">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-[0.14em] text-slate-400">
                    <tr className="border-b border-white/10">
                      {["Asset", "Shares", "Avg", "Last", "Value", "P/L", "Day"].map((heading) => (
                        <th key={heading} className="px-3 py-3 font-semibold">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.rows.map((row) => (
                      <tr key={row.symbol} className="border-b border-white/5">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            <Mark symbol={row.symbol} size="sm" />
                            <div>
                              <p className="font-semibold text-white">{row.name}</p>
                              <p className="text-xs text-slate-400">{row.symbol}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 tabular-nums">{row.shares}</td>
                        <td className="px-3 py-3 tabular-nums">{formatMoney(row.avg)}</td>
                        <td className="px-3 py-3 tabular-nums">{formatMoney(row.price)}</td>
                        <td className="px-3 py-3 font-semibold tabular-nums text-white">{formatMoney(row.value)}</td>
                        <td className="px-3 py-3"><Money value={row.pnl} signed /><span className="ml-2 text-xs"><ChangeText value={row.pnlPct} /></span></td>
                        <td className="px-3 py-3"><ChangeText value={row.dayPct} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </article>
        {!detailed && (
          <button type="button" className="mt-4 text-sm text-slate-400 underline-offset-4 hover:text-amber-200 hover:underline" onClick={resetDesk}>
            Reset demo book
          </button>
        )}
      </div>
    </section>
  );
}
