import { Link } from "react-router-dom";
import { FEATURES } from "../data/content";
import { useMarket } from "../hooks/useMarket";
import { SectionHeading } from "./Ui";

function Icon({ name }) {
  const common = { viewBox: "0 0 24 24", className: "h-6 w-6", fill: "none", stroke: "currentColor", strokeWidth: 1.7, "aria-hidden": true };
  if (name === "shield") {
    return <svg {...common}><path d="M12 3 5 6v6c0 4.2 2.8 7.2 7 9 4.2-1.8 7-4.8 7-9V6l-7-3z" /><path d="m9 12 2 2 4-4" /></svg>;
  }
  if (name === "pulse") {
    return <svg {...common}><path d="M3 12h4l2-5 4 10 2-5h6" /></svg>;
  }
  if (name === "layout") {
    return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 10h16M10 10v10" /></svg>;
  }
  return <svg {...common}><path d="M4 19V5M4 19h16" /><path d="m7 15 4-5 3 3 5-7" /></svg>;
}

export default function WhyChoose() {
  const { user } = useMarket();
  return (
    <section className="border-t border-white/8 py-14 sm:py-16">
      <div className="shell">
        <SectionHeading
          eyebrow="Why Aurix"
          title="A desk that stays out of the way."
          text="Security, a moving tape, a short path to an order, and the numbers that tell you whether the book is working."
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <article key={feature.title} className="panel card-hover relative overflow-hidden p-5">
              <span className="pointer-events-none absolute -top-3 right-3 font-display text-6xl text-white/5">{String(index + 1).padStart(2, "0")}</span>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-300/10 text-amber-200">
                <Icon name={feature.icon} />
              </span>
              <h3 className="mt-4 font-display text-2xl text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="relative mt-12 overflow-hidden">
        <img src="/images/news-city.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-[#060910]/75" />
        <div className="shell relative py-14 text-center sm:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-200">Open the desk</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-4xl text-white sm:text-5xl">Ready when the opening bell is.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">Create a demo login or go straight to the ticket. Nothing here leaves your browser.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to={user ? "/trade" : "/signup"} className="btn btn-gold">{user ? "Place an order" : "Create your login"}</Link>
            <Link to="/stocks" className="btn btn-ghost">See trending stocks</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
