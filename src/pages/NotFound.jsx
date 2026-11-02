import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="shell py-24 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-300">404</p>
      <h1 className="mt-3 font-display text-5xl text-white">That page is off the board.</h1>
      <p className="mx-auto mt-3 max-w-md text-slate-400">The link does not match a desk view. Head back to the market overview.</p>
      <Link to="/" className="btn btn-gold mt-6">Back home</Link>
    </section>
  );
}
