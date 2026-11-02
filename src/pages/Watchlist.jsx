import WatchlistPanel from "../components/WatchlistPanel";
import { PageHero } from "../components/Ui";

export default function Watchlist() {
  return (
    <>
      <PageHero
        eyebrow="Watchlist"
        title="A short list, updated with the tape."
        text="Add a symbol, remove it, and jump into a buy or sell without leaving the price and percentage change in view."
      />
      <WatchlistPanel detailed />
    </>
  );
}
