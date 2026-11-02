import StockBoard from "../components/StockBoard";
import { PageHero } from "../components/Ui";

export default function Stocks() {
  return (
    <>
      <PageHero
        eyebrow="Stocks"
        title="Trending names, with the order one tap away."
        text="Filter by sector, sort the board, and send a buy or sell into the ticket. Stars add a name to your watchlist."
      />
      <StockBoard variant="full" />
    </>
  );
}
