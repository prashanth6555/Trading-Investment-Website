import { IndexGrid, SessionClocks } from "../components/MarketOverview";
import { PageHero } from "../components/Ui";
import { useMarket } from "../hooks/useMarket";

export default function Markets() {
  const { stocks, markets } = useMarket();
  const up = stocks.filter((stock) => stock.change >= 0).length;
  const down = stocks.length - up;
  const advancers = markets.filter((market) => market.change >= 0).length;

  return (
    <>
      <PageHero
        eyebrow="Markets"
        title="Session clocks and the benchmarks that lead them."
        text="New York, Mumbai, London, and Tokyo, plus the indices and gold quote that sit on the Aurix tape."
      />
      <section className="py-10 sm:py-12">
        <div className="shell">
          <SessionClocks large />
          <div className="panel mt-4 p-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl text-white">Breadth</h2>
                <p className="text-sm text-slate-400">{advancers} of {markets.length} boards are higher. Stock sample: {up} up, {down} down.</p>
              </div>
              <p className="text-sm font-semibold text-emerald-300">{up} advancers</p>
            </div>
            <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-rose-400/30">
              <div className="h-full bg-[#3ddc97]" style={{ width: `${(up / stocks.length) * 100}%` }} />
            </div>
          </div>
          <div className="mt-4">
            <IndexGrid />
          </div>
        </div>
      </section>
    </>
  );
}
