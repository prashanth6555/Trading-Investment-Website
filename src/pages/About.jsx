import { STATS, TEAM } from "../data/content";
import { PageHero } from "../components/Ui";

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Built for people who want the number, then the action."
        text="Aurix is a demonstration trading desk: a full market overview, a book you can change, and an order path that asks before it fills."
      />
      <section className="py-10 sm:py-12">
        <div className="shell grid items-center gap-6 lg:grid-cols-2">
          <img src="/images/office.jpg" alt="Bright modern office corridor used as the Aurix studio" className="h-72 w-full rounded-[1.5rem] object-cover sm:h-96" />
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">A calmer screen for a noisy market.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              Most retail layouts hide the total until the last second. Aurix keeps the tape, the position, and the order summary on the same surface. The quotes are simulated so the interface can move without a brokerage connection.
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
              The book you see is sample inventory. Buy and sell it, reset it, and the chart, cash, and holdings stay in agreement. That is the product: not more widgets, a desk that adds up.
            </p>
          </div>
        </div>
        <div className="shell mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {STATS.map((stat) => (
            <article key={stat.label} className="panel p-4">
              <p className="font-display text-3xl text-amber-200">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="pb-14">
        <div className="shell">
          <h2 className="font-display text-3xl text-white">The desk leads</h2>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {TEAM.map((person) => (
              <article key={person.name} className="panel card-hover overflow-hidden">
                <img src={person.image} alt={`Portrait of ${person.name}`} className="h-64 w-full object-cover object-top" />
                <div className="p-4">
                  <h3 className="font-display text-xl text-white">{person.name}</h3>
                  <p className="text-sm text-amber-200">{person.role}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{person.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
