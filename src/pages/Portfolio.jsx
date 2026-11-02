import PortfolioPanel from "../components/PortfolioPanel";
import { PageHero } from "../components/Ui";

export default function Portfolio() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Value, profit, and the positions behind them."
        text="Today's change, total profit or loss, allocation, and a performance chart that follows the book on this device."
      />
      <PortfolioPanel detailed />
    </>
  );
}
