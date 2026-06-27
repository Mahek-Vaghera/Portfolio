import { X, Folder, FileBox, Workflow } from "lucide-react";
import { MethodPill } from "./MethodPill";
import { cn } from "@/lib/utils";
import { findEndpoint } from "@/lib/mockApi";
import { projects } from "@/data";
function TabBar({ tabs, activeId, onSelect, onClose }) {
  return (
    <div
      data-tour="tabbar"
      className="h-9 border-b border-border bg-card/30 flex items-stretch overflow-x-auto scrollbar-thin shrink-0"
    >
      {tabs.length === 0 && (
        <div className="px-3 flex items-center text-[11px] text-muted-foreground">
          No open tabs
        </div>
      )}
      {tabs.map((t) => {
        const active = t.id === activeId;
        let label = "Untitled";
        let icon = null;
        const isOverview = t.kind === "overview";
        if (t.kind === "endpoint") {
          const spec = findEndpoint(t.endpointId);
          if (spec) {
            icon = <MethodPill method={spec.method} />;
            label = spec.path;
          }
        } else if (t.kind === "project") {
          const p = projects.find((x) => x.id === t.projectId);
          icon = <Folder className="h-3 w-3 text-[hsl(var(--syntax-fn))]" />;
          label = p?.name ?? "Project";
        } else if (t.kind === "journey") {
          icon = <Workflow className="h-3 w-3 text-accent" />;
          label = "Journey";
        } else {
          icon = <FileBox className="h-3 w-3 text-primary" />;
          label = "Overview";
        }
        return (
          <div
            key={t.id}
            data-tour={isOverview ? "overview-tab" : void 0}
            onClick={() => onSelect(t.id)}
            className={cn(
              "group cursor-pointer flex items-center gap-2 px-3 border-r border-border text-xs min-w-0 max-w-[240px]",
              active
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
            )}
          >
            {icon}
            <span className="truncate">{label}</span>
            {!isOverview && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(t.id);
                }}
                className="ml-1 h-4 w-4 grid place-items-center rounded hover:bg-secondary opacity-60 hover:opacity-100"
                aria-label="Close tab (Alt+W)"
                title="Close tab (Alt+W)"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
export { TabBar };
