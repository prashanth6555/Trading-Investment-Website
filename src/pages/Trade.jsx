import TradeTicket from "../components/TradeTicket";
import { PageHero } from "../components/Ui";

export default function Trade() {
  return (
    <>
      <PageHero
        eyebrow="Trade"
        title="Size it, price it, then confirm."
        text="Market and limit tickets share one summary: quantity, estimated total, fees, and the cash you will have left."
      />
      <section className="py-10 sm:py-12">
        <div className="shell">
          <TradeTicket framed={false} />
        </div>
      </section>
    </>
  );
}
