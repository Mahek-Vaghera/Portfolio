import { useState } from "react";
import { MethodPill } from "./MethodPill";
import {
  Github,
  ExternalLink,
  BookOpen,
  Wrench,
  Sparkles,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";
const tabs = [
  {
    id: "overview",
    label: "Overview",
    icon: BookOpen,
  },
  {
    id: "stack",
    label: "Stack",
    icon: Wrench,
  },
  {
    id: "features",
    label: "Features",
    icon: Sparkles,
  },
  {
    id: "apis",
    label: "APIs",
    icon: Link2,
  },
  {
    id: "links",
    label: "Links",
    icon: ExternalLink,
  },
];
const statusColor = (s) =>
  s === "live"
    ? "text-[hsl(var(--success))] bg-[hsl(var(--success))]/10 border-[hsl(var(--success))]/30"
    : s === "wip"
      ? "text-[hsl(var(--warning))] bg-[hsl(var(--warning))]/10 border-[hsl(var(--warning))]/30"
      : "text-[hsl(var(--info))] bg-[hsl(var(--info))]/10 border-[hsl(var(--info))]/30";
function ProjectPanel({ project }) {
  const [sub, setSub] = useState("overview");
  return (
    <section className="flex-1 min-h-0 flex flex-col bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-start gap-3 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-display text-foreground">
                {project.name}
              </h1>
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border",
                  statusColor(project.status),
                )}
              >
                {project.status}
              </span>
              <span className="text-[11px] text-muted-foreground">
                · {project.year} · {project.role}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {project.tagline}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className="h-8 px-3 rounded-md border border-border hover:bg-secondary text-xs flex items-center gap-1.5"
              >
                <Github className="h-3.5 w-3.5" /> GitHub
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noreferrer"
                className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Live
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="px-4 border-b border-border flex items-center gap-1 text-[11px] shrink-0">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setSub(t.id)}
              className={cn(
                "px-3 py-2 border-b-2 -mb-px transition-colors flex items-center gap-1.5",
                sub === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-3 w-3" />
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
        {sub === "overview" && (
          <div className="space-y-4 max-w-3xl">
            <Card title="Description">
              <p className="text-sm text-foreground/90 leading-relaxed">
                {project.description}
              </p>
            </Card>
            <Card title="Problem it solves">
              <p className="text-sm text-foreground/80 leading-relaxed">
                {project.problem}
              </p>
            </Card>
          </div>
        )}
        {sub === "stack" && (
          <Card title="Tech stack">
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span
                  key={`${project.id}:stack:${s}`}
                  className="px-2 py-1 rounded-md bg-secondary border border-border text-xs font-mono"
                >
                  {s}
                </span>
              ))}
            </div>
          </Card>
        )}
        {sub === "features" && (
          <Card title="Key features">
            <ul className="space-y-2">
              {project.features.map((f) => (
                <li
                  key={`${project.id}:feature:${f}`}
                  className="flex gap-2 text-sm text-foreground/90"
                >
                  <span className="text-primary mt-0.5">▸</span>
                  {f}
                </li>
              ))}
            </ul>
          </Card>
        )}
        {sub === "apis" && (
          <Card title="Endpoints">
            <ul className="space-y-1">
              {project.apis.map((a) => (
                <li
                  key={`${a.method}:${a.path}`}
                  className="grid grid-cols-[60px_220px_1fr] gap-3 items-center text-xs font-mono py-1.5 border-b border-border/60 last:border-0"
                >
                  <MethodPill method={a.method} />
                  <code className="text-foreground truncate">{a.path}</code>
                  <span className="text-muted-foreground font-sans">
                    {a.purpose}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}
        {sub === "links" && (
          <Card title="Links">
            <ul className="space-y-2 text-sm">
              {project.links.github && (
                <LinkRow
                  icon={Github}
                  label="Source code"
                  url={project.links.github}
                />
              )}
              {project.links.demo && (
                <LinkRow
                  icon={ExternalLink}
                  label="Live demo"
                  url={project.links.demo}
                />
              )}
              {project.links.docs && (
                <LinkRow
                  icon={BookOpen}
                  label="Documentation"
                  url={project.links.docs}
                />
              )}
              {!project.links.github &&
                !project.links.demo &&
                !project.links.docs && (
                  <p className="text-xs text-muted-foreground">
                    No external links yet.
                  </p>
                )}
            </ul>
          </Card>
        )}
      </div>
    </section>
  );
}
function Card({ title, children }) {
  return (
    <div className="rounded-lg border border-border bg-card/40 p-4">
      <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}
function LinkRow({ icon: Icon, label, url }) {
  return (
    <li>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 text-primary hover:underline"
      >
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
        <span className="text-muted-foreground truncate">— {url}</span>
      </a>
    </li>
  );
}
export { ProjectPanel };
