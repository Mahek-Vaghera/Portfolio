import {
  Github,
  Mail,
  Trophy,
  Rocket,
  Code2,
  Code,
  Linkedin,
  MapPin,
  ArrowRight,
  PlayCircle,
  Send,
  Sparkles,
} from "lucide-react";
import {
  overviewHeadline,
  overviewSocialChips,
  overviewStats,
  overviewStarters,
} from "@/data/overviewPageData";
import { projectCategories } from "@/data/projectsData";
const chipIcon = (kind) => {
  switch (kind) {
    case "github":
      return Github;
    case "codolio":
      return Trophy;
    case "codeforces":
      return Code2;
    case "leetcode":
      return Code;
    case "linkedin":
      return Linkedin;
    case "email":
      return Mail;
    default:
      return Github;
  }
};
const methodColor = (label) => {
  if (label.startsWith("POST")) return "text-[hsl(var(--warning))]";
  if (label.startsWith("GET")) return "text-[hsl(var(--success))]";
  if (label.startsWith("DELETE")) return "text-[hsl(var(--destructive))]";
  return "text-primary";
};
function OverviewPanel({ onPickEndpoint, onPickProject }) {
  return (
    <section className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        <header className="relative rounded-xl border border-border bg-card/40 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card/60">
            <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--destructive))]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--warning))]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--success))]" />
            <span className="ml-3 text-[11px] font-mono text-muted-foreground">
              ~ / {overviewHeadline.name.toLowerCase().replace(/\s+/g, "-")} —
              whoami
            </span>
          </div>
          <div className="p-5 sm:p-6 font-mono text-[13px] space-y-1.5">
            <div>
              <span className="text-[hsl(var(--success))]">$</span>{" "}
              <span className="text-muted-foreground">whoami</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight pt-1">
              {overviewHeadline.name}
            </h1>
            <p className="text-sm text-primary">
              {overviewHeadline.role} · {overviewHeadline.focus}
            </p>
            <div className="pt-3 grid grid-cols-1 sm:grid-cols-[6rem_1fr] gap-x-3 gap-y-1 text-[13px]">
              <span className="text-[hsl(var(--warning))]">Tagline</span>
              <span className="text-foreground/90 italic">
                "{overviewHeadline.tagline}"
              </span>
              <span className="text-[hsl(var(--warning))]">Location</span>
              <span className="text-foreground/90 inline-flex items-center gap-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                {overviewHeadline.location}
              </span>
              <span className="text-[hsl(var(--warning))]">About</span>
              <span className="text-muted-foreground leading-relaxed">
                {overviewHeadline.bio}
              </span>
            </div>
            <div className="pt-5 mt-2 border-t border-border/60 flex flex-wrap items-center gap-2">
              {overviewSocialChips.map((c) => (
                <SocialChip
                  key={c.label}
                  href={c.href}
                  icon={chipIcon(c.kind)}
                  label={c.label}
                />
              ))}
              <button
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("portfolio:replay-tour"))
                }
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary text-xs transition-colors ml-auto"
              >
                <PlayCircle className="h-3.5 w-3.5" /> Replay tour
              </button>
            </div>
          </div>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {overviewStats.map((s) => (
            <Stat key={s.label} label={s.label} value={s.value} sub={s.sub} />
          ))}
        </div>
        <section>
          <SectionTitle icon={Sparkles}>Try these endpoints</SectionTitle>
          <div className="rounded-lg border border-border bg-card/30 divide-y divide-border/60 overflow-hidden">
            {overviewStarters.map((s) => {
              const [method, ...rest] = s.label.split(" ");
              const path = rest.join(" ");
              return (
                <button
                  key={s.id}
                  onClick={() => onPickEndpoint(s.id)}
                  className="w-full group flex items-center gap-3 text-left px-4 py-2.5 hover:bg-secondary/60 transition-colors text-xs font-mono"
                >
                  <span
                    className={`w-12 shrink-0 font-bold ${methodColor(s.label)}`}
                  >
                    {method}
                  </span>
                  <span className="flex-1 truncate text-foreground/90">
                    {path}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })}
          </div>
        </section>
        {projectCategories.map((cat) => (
          <section key={cat.id}>
            <SectionTitle icon={cat.id === "active" ? Rocket : Send}>
              {cat.label}
            </SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.items.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onPickProject(p.id)}
                  className="text-left p-4 rounded-lg border border-border bg-card/40 hover:border-primary/40 hover:bg-secondary/40 transition-all group flex flex-col gap-2 min-h-[7.5rem]"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-foreground group-hover:text-primary truncate">
                      {p.name}
                    </h3>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground ml-auto shrink-0 border border-border rounded px-1.5 py-0.5">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                    {p.tagline}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {p.stack.slice(0, 4).map((s) => (
                      <span
                        key={`${p.id}:stack:${s}`}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-secondary border border-border font-mono text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
        {/* <footer className="pt-2 pb-4 text-center text-[11px] text-muted-foreground font-mono">
        
        </footer> */}
      </div>
    </section>
  );
}
function SectionTitle({ children, icon: Icon }) {
  return (
    <h2 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
      {Icon && <Icon className="h-3 w-3" />}
      {children}
      <span className="flex-1 h-px bg-border ml-2" />
    </h2>
  );
}
function SocialChip({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-background/40 hover:bg-secondary/80 hover:border-primary/40 hover:text-primary text-xs transition-colors"
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </a>
  );
}
function Stat({ label, value, sub }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card/40 hover:border-primary/30 transition-colors">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="text-2xl font-bold text-foreground font-display mt-1">
        {value}
      </div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}
export { OverviewPanel };
