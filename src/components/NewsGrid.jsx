import { useState } from "react";
import { NEWS } from "../data/content";
import { Modal, SectionHeading } from "./Ui";

export default function NewsGrid() {
  const [active, setActive] = useState(null);
  const items = NEWS;

  return (
    <section className="py-14 sm:py-16">
      <div className="shell">
        <SectionHeading
          eyebrow="Market news"
          title="What the desk is reading."
          text="Sample briefings with a date, a category, and a full note when you ask for more."
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((article) => (
            <article key={article.id} className="panel card-hover overflow-hidden">
              <div className="relative h-44 bg-[#132033]">
                <img
                  src={article.image}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <span className="absolute top-3 left-3 rounded-full bg-[#060910]/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-amber-200">
                  {article.category}
                </span>
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-400">{article.date} · {article.read} read</p>
                <h3 className="mt-2 font-display text-xl leading-snug text-white">{article.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{article.excerpt}</p>
                <button type="button" className="mt-4 text-sm font-bold text-amber-200" onClick={() => setActive(article)}>
                  Read more
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Modal open={Boolean(active)} title={active?.category || "Story"} onClose={() => setActive(null)}>
        {active && (
          <article>
            <img src={active.image} alt="" className="h-48 w-full rounded-2xl object-cover" />
            <p className="mt-4 text-xs text-slate-400">{active.date} · {active.read} read</p>
            <h4 className="mt-2 font-display text-2xl text-white">{active.title}</h4>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              {active.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
        )}
      </Modal>
    </section>
  );
}
