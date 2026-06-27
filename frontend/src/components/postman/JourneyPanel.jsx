import { useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Briefcase,
  Rocket,
  Trophy,
  School,
  Sparkles,
  Calendar,
  Building2,
} from "lucide-react";
import { journeyCards, journeyMeta } from "@/data/journeyData";
import { cn } from "@/lib/utils";
const iconFor = (kind) => {
  switch (kind) {
    case "school":
      return School;
    case "college":
      return GraduationCap;
    case "intern":
      return Briefcase;
    case "project":
      return Rocket;
    case "cp":
      return Trophy;
    default:
      return Sparkles;
  }
};
const accentFor = (kind) => {
  switch (kind) {
    case "current":
      return "from-primary/30 via-accent/20 to-transparent border-primary/50";
    case "cp":
      return "from-[hsl(var(--warning)/0.25)] to-transparent border-[hsl(var(--warning)/0.5)]";
    case "project":
      return "from-[hsl(var(--info)/0.22)] to-transparent border-[hsl(var(--info)/0.5)]";
    case "intern":
      return "from-[hsl(var(--accent)/0.22)] to-transparent border-[hsl(var(--accent)/0.5)]";
    case "college":
      return "from-primary/20 to-transparent border-primary/40";
    default:
      return "from-secondary/60 to-transparent border-border";
  }
};
function JourneyPanel({ selectedId, onSelect }) {
  const activeIndex = Math.max(
    0,
    journeyCards.findIndex((c) => c.id === selectedId),
  );
  const active = journeyCards[activeIndex];
  const stripRef = useRef(null);
  const itemRefs = useRef({});
  useEffect(() => {
    const el = itemRefs.current[active.id];
    if (el)
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
  }, [active.id]);
  const go = (delta) => {
    const next =
      journeyCards[
        Math.min(journeyCards.length - 1, Math.max(0, activeIndex + delta))
      ];
    if (next) onSelect(next);
  };
  const scrollStrip = (delta) => {
    stripRef.current?.scrollBy({
      left: delta,
      behavior: "smooth",
    });
  };
  const Icon = iconFor(active.kind);
  return (
    <section className="flex-1 min-h-0 flex flex-col">
      <header className="px-8 pt-6 pb-3 border-b border-border/60">
        <div className="flex items-end justify-between gap-4 max-w-5xl mx-auto w-full">
          <div>
            <h1 className="text-xl font-bold font-display text-foreground">
              {journeyMeta.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {journeyMeta.subtitle}
            </p>
          </div>
          <div className="text-[11px] font-mono text-muted-foreground shrink-0">
            {activeIndex + 1} / {journeyCards.length}
          </div>
        </div>
      </header>
      <div className="flex-1 min-h-0 overflow-hidden grid place-items-center p-8">
        <div className="relative w-full max-w-3xl">
          <button
            onClick={() => go(1)}
            disabled={activeIndex >= journeyCards.length - 1}
            aria-label="Older"
            className="absolute -left-3 sm:-left-12 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full border border-border bg-card hover:bg-secondary/80 disabled:opacity-30 disabled:cursor-not-allowed z-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(-1)}
            disabled={activeIndex <= 0}
            aria-label="Newer"
            className="absolute -right-3 sm:-right-12 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full border border-border bg-card hover:bg-secondary/80 disabled:opacity-30 disabled:cursor-not-allowed z-10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <article
            className={cn(
              "rounded-2xl border p-8 sm:p-10 bg-gradient-to-br relative overflow-hidden min-h-[280px] animate-in fade-in zoom-in-95 duration-500",
              accentFor(active.kind),
            )}
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
            <div className="flex items-center gap-3 relative">
              <span className="h-11 w-11 grid place-items-center rounded-lg bg-background/60 border border-border">
                <Icon className="h-5 w-5 text-primary" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {active.kind === "current" ? "Right now" : active.kind}
              </span>
              <span className="ml-auto text-sm font-mono text-primary font-bold">
                {active.year}
              </span>
            </div>
            <h2 className="mt-6 text-2xl sm:text-3xl font-bold font-display text-foreground leading-tight">
              {active.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" /> {active.org}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> {active.year}
              </span>
            </div>
            <p className="mt-5 text-sm sm:text-base text-foreground/85 leading-relaxed max-w-2xl">
              {active.detail}
            </p>
          </article>
        </div>
      </div>
      <div className="border-t border-border/60 bg-card/30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2">
          <button
            onClick={() => scrollStrip(-240)}
            className="h-8 w-8 shrink-0 grid place-items-center rounded-md border border-border bg-background/60 hover:bg-secondary/60"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div
            ref={stripRef}
            className="flex-1 flex gap-2 overflow-x-auto scrollbar-thin scroll-smooth snap-x"
          >
            {journeyCards.map((c) => {
              const I = iconFor(c.kind);
              const isActive = c.id === active.id;
              return (
                <button
                  key={c.id}
                  ref={(el) => (itemRefs.current[c.id] = el)}
                  onClick={() => onSelect(c)}
                  className={cn(
                    "snap-center shrink-0 w-44 text-left p-3 rounded-lg border transition-all",
                    isActive
                      ? "border-primary/60 bg-primary/10 ring-1 ring-primary/40 scale-[1.02]"
                      : "border-border bg-background/40 hover:border-primary/30 hover:bg-secondary/60",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <I className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[10px] font-mono text-primary font-bold">
                      {c.year}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-foreground mt-1 line-clamp-1">
                    {c.title}
                  </div>
                  <div className="text-[10px] text-muted-foreground line-clamp-1">
                    {c.org}
                  </div>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => scrollStrip(240)}
            className="h-8 w-8 shrink-0 grid place-items-center rounded-md border border-border bg-background/60 hover:bg-secondary/60"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
export { JourneyPanel };
