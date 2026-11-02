import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { MarketProvider } from "./context/MarketContext";
import About from "./pages/About";
import { Login, Signup } from "./pages/Auth";
import Home from "./pages/Home";
import { Privacy, Terms } from "./pages/Legal";
import Markets from "./pages/Markets";
import NotFound from "./pages/NotFound";
import Portfolio from "./pages/Portfolio";
import Stocks from "./pages/Stocks";
import Trade from "./pages/Trade";
import Watchlist from "./pages/Watchlist";

export default function App() {
  return (
    <MarketProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="markets" element={<Markets />} />
            <Route path="stocks" element={<Stocks />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="watchlist" element={<Watchlist />} />
            <Route path="trade" element={<Trade />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MarketProvider>
  );
}
