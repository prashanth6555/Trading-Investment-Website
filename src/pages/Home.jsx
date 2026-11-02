import Hero from "../components/Hero";
import MarketOverview from "../components/MarketOverview";
import NewsGrid from "../components/NewsGrid";
import PortfolioPanel from "../components/PortfolioPanel";
import StockBoard from "../components/StockBoard";
import TradeTicket from "../components/TradeTicket";
import WatchlistPanel from "../components/WatchlistPanel";
import WhyChoose from "../components/WhyChoose";

export default function Home() {
  return (
    <>
      <Hero />
      <MarketOverview />
      <StockBoard />
      <PortfolioPanel />
      <WatchlistPanel />
      <TradeTicket />
      <NewsGrid />
      <WhyChoose />
    </>
  );
}
