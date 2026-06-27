import { Fragment, useState } from "react";
import {
  Folder,
  History,
  Workflow,
  FolderGit2,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Trophy,
  Code,
} from "lucide-react";
import { social } from "@/data";
import { cn } from "@/lib/utils";
const items = [
  {
    id: "resume",
    label: "Resume",
    icon: Folder,
    tour: "rail-resume",
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderGit2,
    tour: "rail-projects",
  },
  {
    id: "history",
    label: "History",
    icon: History,
    tour: "rail-history",
  },
];
const socials = [
  {
    href: social.github,
    label: "GitHub",
    icon: Github,
  },
  {
    href: social.codolio,
    label: "Codolio",
    icon: Trophy,
  },
  {
    href: social.leetcode,
    label: "LeetCode",
    icon: Code,
  },
  {
    href: social.email,
    label: "Email",
    icon: Mail,
  },
  {
    href: social.linkedin,
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: social.resume,
    label: "Download Resume",
    icon: FileDown,
  },
];
function IconRail({ active, onSelect, onOpenJourney }) {
  return (
    <nav className="w-14 shrink-0 border-r border-border bg-card/60 flex flex-col items-center py-2 gap-1">
      <RailButton
        label="Resume"
        active={active === "resume"}
        onClick={() => onSelect("resume")}
        dataTour="rail-resume"
      >
        <Folder className="h-4 w-4" />
      </RailButton>
      <RailButton
        label="Projects"
        active={active === "projects"}
        onClick={() => onSelect("projects")}
        dataTour="rail-projects"
      >
        <FolderGit2 className="h-4 w-4" />
      </RailButton>
      <RailButton
        label="Journey"
        active={active === "journey"}
        onClick={() => {
          onSelect("journey");
          onOpenJourney();
        }}
        dataTour="rail-flows"
      >
        <Workflow className="h-4 w-4" />
      </RailButton>
      <RailButton
        label="History"
        active={active === "history"}
        onClick={() => onSelect("history")}
        dataTour="rail-history"
      >
        <History className="h-4 w-4" />
      </RailButton>
      <div className="flex-1" />
      <div className="w-8 h-px bg-border my-1" />
      <div
        data-tour="socials"
        className="flex flex-col items-center gap-1 py-1 px-1 rounded-md"
      >
        {socials.map((s) => {
          const Icon = s.icon;
          return (
            <RailButton key={s.label} label={s.label} href={s.href}>
              <Icon className="h-4 w-4" />
            </RailButton>
          );
        })}
      </div>
    </nav>
  );
}
function RailButton({ children, label, active, onClick, href, dataTour }) {
  const [hover, setHover] = useState(false);
  const cls = cn(
    "relative h-10 w-10 grid place-items-center rounded-md transition-colors",
    active
      ? "bg-primary/15 text-primary"
      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
  );
  const content = (
    <Fragment>
      {active && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-primary" />
      )}
      {children}
      {hover && (
        <span className="absolute left-full ml-2 z-50 whitespace-nowrap rounded-md bg-popover border border-border px-2 py-1 text-[11px] text-foreground shadow-card">
          {label}
        </span>
      )}
    </Fragment>
  );
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={cls}
        data-tour={dataTour}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      onClick={onClick}
      className={cls}
      data-tour={dataTour}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {content}
    </button>
  );
}
export { IconRail };
