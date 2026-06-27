import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { sections } from "@/data";
import { MethodPill } from "../MethodPill";
import { cn } from "@/lib/utils";
function ResumeView({ activeEndpointId, onOpen }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(() =>
    Object.fromEntries(sections.map((s, i) => [s.id, i < 3])),
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map((s) => ({
        ...s,
        endpoints: s.endpoints.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.path.toLowerCase().includes(q) ||
            s.name.toLowerCase().includes(q),
        ),
      }))
      .filter((s) => s.endpoints.length > 0);
  }, [query]);
  return (
    <div className="flex flex-col h-full">
      <Header title="Resume" subtitle="My resume as a REST API" />
      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search endpoints…"
            className="w-full bg-secondary border border-border rounded-md pl-8 pr-2 py-1.5 text-xs focus:outline-none focus:border-primary"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin pb-3">
        {filtered.map((s) => {
          const isOpen = open[s.id] ?? true;
          return (
            <div key={s.id}>
              <button
                onClick={() =>
                  setOpen((p) => ({
                    ...p,
                    [s.id]: !isOpen,
                  }))
                }
                className="w-full px-3 py-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                {isOpen ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                <span>{s.name}</span>
                <span className="ml-auto text-[10px] opacity-60">
                  {s.endpoints.length}
                </span>
              </button>
              {isOpen && (
                <ul>
                  {s.endpoints.map((e) => (
                    <li key={e.id}>
                      <button
                        onClick={() => onOpen(e)}
                        className={cn(
                          "w-full text-left px-3 py-1.5 pl-7 flex items-center gap-2 text-xs hover:bg-secondary/60",
                          activeEndpointId === e.id && "bg-secondary",
                        )}
                      >
                        <MethodPill
                          method={e.method}
                          className="w-10 shrink-0"
                        />
                        <span className="truncate">{e.path}</span>
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
function Header({ title, subtitle, action }) {
  return (
    <div className="p-3 border-b border-border flex items-center gap-2">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-foreground truncate">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[10px] text-muted-foreground truncate">
            {subtitle}
          </p>
        )}
      </div>
      <div className="ml-auto">{action}</div>
    </div>
  );
}
export { Header, ResumeView };
