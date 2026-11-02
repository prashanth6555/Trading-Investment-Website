import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Ticker from "./Ticker";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[90] focus:rounded-full focus:bg-amber-300 focus:px-4 focus:py-2 focus:text-[#1a1204]">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="pt-16">
        <Ticker />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
