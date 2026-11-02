import { Link } from "react-router-dom";
import { PageHero } from "../components/Ui";

function Block({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-2xl text-white">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-slate-300">{children}</div>
    </section>
  );
}

export function Privacy() {
  return (
    <>
      <PageHero eyebrow="Privacy" title="Privacy Policy" text="How this demo treats information you type into the browser. It is sample policy copy for the interface, not a law-firm document." />
      <div className="shell max-w-3xl py-10">
        <Block title="What stays on this device">
          <p>Watchlists are stored in local storage. The demo portfolio, orders, and login name are stored in session storage and clear when the session ends or when you reset the book. Aurix does not run an account server.</p>
        </Block>
        <Block title="What you type">
          <p>Names, emails, and passwords in the login forms are checked in the browser and are not transmitted. Do not use a real password you use elsewhere. The password is not saved.</p>
        </Block>
        <Block title="Market data">
          <p>Prices, news, and charts are fictional or simulated for the layout. They are not quotes from an exchange and should not be used to make financial decisions.</p>
        </Block>
        <Block title="Contact">
          <p>Questions about this demo can be sent to <a className="text-amber-200" href="mailto:hello@aurix.markets">hello@aurix.markets</a>. See also the <Link className="text-amber-200" to="/terms">Terms & Conditions</Link>.</p>
        </Block>
      </div>
    </>
  );
}

export function Terms() {
  return (
    <>
      <PageHero eyebrow="Terms" title="Terms & Conditions" text="Rules for using this demonstration. They do not create a brokerage account or a right to trade real securities." />
      <div className="shell max-w-3xl py-10">
        <Block title="A demonstration, not a broker">
          <p>Aurix is a front-end project. Orders are imaginary fills against sample positions. No security is purchased, sold, or custodied.</p>
        </Block>
        <Block title="No advice">
          <p>Nothing on the site is a recommendation, solicitation, or research report. Performance figures are scaled illustrations tied to the demo book.</p>
        </Block>
        <Block title="Acceptable use">
          <p>Do not attempt to treat the interface as a live venue, scrape it as a data feed, or present the simulated numbers as real market prices.</p>
        </Block>
        <Block title="Liability">
          <p>The interface is provided as-is for educational and design purposes. You are responsible for decisions you make in real markets, which this site cannot execute.</p>
          <p>Read the <Link className="text-amber-200" to="/privacy">Privacy Policy</Link> for how demo data is stored locally.</p>
        </Block>
      </div>
    </>
  );
}
