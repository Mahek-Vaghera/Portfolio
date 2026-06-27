import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileCode2,
} from "lucide-react";
import { projectCategories } from "@/data/projectsData";
import { Header } from "./ResumeView";
import { cn } from "@/lib/utils";
function ProjectsView({ activeProjectId, onOpen }) {
  const [open, setOpen] = useState(() =>
    Object.fromEntries(projectCategories.map((c) => [c.id, true])),
  );
  return (
    <div className="flex flex-col h-full">
      <Header title="Projects" subtitle="Arsenal · click any to open" />
      <div className="flex-1 overflow-y-auto scrollbar-thin py-1">
        {projectCategories.map((cat) => {
          const isOpen = open[cat.id] ?? true;
          const Icon = isOpen ? FolderOpen : Folder;
          return (
            <div key={cat.id}>
              <button
                onClick={() =>
                  setOpen((s) => ({
                    ...s,
                    [cat.id]: !isOpen,
                  }))
                }
                className="w-full px-3 py-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                {isOpen ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                <Icon className="h-3.5 w-3.5 text-[hsl(var(--syntax-fn))]" />
                <span>{cat.label}</span>
                <span className="ml-auto text-[10px] opacity-60">
                  {cat.items.length}
                </span>
              </button>
              {isOpen && (
                <ul className="mb-1">
                  {cat.items.length === 0 && (
                    <li className="px-3 pl-10 py-1 text-[11px] text-muted-foreground italic">
                      Nothing here yet.
                    </li>
                  )}
                  {cat.items.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => onOpen(p)}
                        className={cn(
                          "w-full text-left flex items-center gap-2 pl-10 pr-3 py-1.5 text-xs hover:bg-secondary/60",
                          activeProjectId === p.id && "bg-secondary",
                        )}
                      >
                        <FileCode2 className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate">{p.name}</span>
                        <StatusDot status={p.status} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
function StatusDot({ status }) {
  const color =
    status === "live"
      ? "bg-[hsl(var(--success))]"
      : status === "wip"
        ? "bg-[hsl(var(--warning))]"
        : "bg-[hsl(var(--info))]";
  return (
    <span
      className={cn("ml-auto h-1.5 w-1.5 rounded-full shrink-0", color)}
      title={status}
    />
  );
}
export { ProjectsView };
