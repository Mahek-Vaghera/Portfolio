import { Trash2 } from "lucide-react";
import { Fragment } from "react";
import { Header } from "./ResumeView";
import { MethodPill } from "../MethodPill";
import { cn } from "@/lib/utils";
import { allEndpoints } from "@/data";
function HistoryView({ history, saved, onOpenById, onClear }) {
  const savedEndpoints = allEndpoints.filter((e) => saved.includes(e.id));
  return (
    <div className="flex flex-col h-full">
      <Header
        title="History"
        subtitle={`${history.length} request${history.length === 1 ? "" : "s"} \xB7 ${saved.length} starred`}
        action={
          history.length > 0 && (
            <button
              onClick={onClear}
              className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" /> clear
            </button>
          )
        }
      />
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {savedEndpoints.length > 0 && (
          <Fragment>
            <div className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Starred
            </div>
            <ul>
              {savedEndpoints.map((e) => (
                <li key={e.id}>
                  <button
                    onClick={() => onOpenById(e.id)}
                    className="w-full text-left px-3 py-1.5 hover:bg-secondary/60 text-xs flex items-center gap-2"
                  >
                    <MethodPill method={e.method} className="w-10 shrink-0" />
                    <span className="truncate">{e.path}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Fragment>
        )}
        <div className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
          Recent
        </div>
        {history.length === 0 ? (
          <p className="px-3 text-[11px] text-muted-foreground">
            No requests sent yet.
          </p>
        ) : (
          <ul>
            {history.map((h) => (
              <li key={h.id}>
                <button
                  onClick={() => onOpenById(h.endpointId)}
                  className="w-full text-left px-3 py-1.5 hover:bg-secondary/60 text-xs flex items-center gap-2"
                >
                  <MethodPill method={h.method} className="w-10 shrink-0" />
                  <span className="truncate flex-1">{h.url}</span>
                  <span
                    className={cn(
                      "text-[10px] font-bold",
                      h.status < 300
                        ? "text-[hsl(var(--success))]"
                        : "text-[hsl(var(--destructive))]",
                    )}
                  >
                    {h.status}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
export { HistoryView };
