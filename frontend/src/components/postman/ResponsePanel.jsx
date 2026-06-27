import { Copy } from "lucide-react";
import { Fragment, useState } from "react";
import { JsonView } from "./JsonView";
import { WebView } from "./WebView";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
function ResponsePanel({ response, loading }) {
  const [tab, setTab] = useState("raw");
  const copyBody = async () => {
    if (!response) return;
    await navigator.clipboard.writeText(JSON.stringify(response.body, null, 2));
    toast.success("Response copied");
  };
  return (
    <section className="flex-1 min-h-0 flex flex-col bg-background">
      <header className="px-3 py-2 border-b border-border flex items-center gap-3 text-[11px] shrink-0">
        <span className="uppercase tracking-wider text-muted-foreground">
          Response
        </span>
        {response && (
          <Fragment>
            <span
              className={cn(
                "font-bold",
                response.status < 300
                  ? "text-[hsl(var(--success))]"
                  : response.status < 400
                    ? "text-[hsl(var(--info))]"
                    : "text-[hsl(var(--destructive))]",
              )}
            >
              {response.status} {response.statusText}
            </span>
            <span className="text-muted-foreground">
              · {response.timeMs} ms · {response.size}
            </span>
            <div className="flex-1" />
            <button
              onClick={copyBody}
              className="h-7 px-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground flex items-center gap-1.5"
            >
              <Copy className="h-3 w-3" />
              copy
            </button>
          </Fragment>
        )}
        {loading && (
          <span className="text-muted-foreground animate-pulse">
            …awaiting response
          </span>
        )}
      </header>
      {response ? (
        <Fragment>
          <div className="px-3 border-b border-border flex items-center gap-1 text-[11px] shrink-0">
            {[
              {
                id: "raw",
                label: "Raw",
              },
              {
                id: "web",
                label: "Web-view",
              },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setTab(s.id)}
                className={cn(
                  "px-3 py-2 border-b-2 -mb-px transition-colors",
                  tab === s.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex-1 min-h-0 overflow-auto scrollbar-thin">
            {tab === "raw" ? (
              <div className="p-4">
                <JsonView value={response.body} />
              </div>
            ) : (
              <WebView value={response.body} />
            )}
          </div>
        </Fragment>
      ) : (
        <div className="flex-1 grid place-items-center text-xs text-muted-foreground">
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
              Sending request to mahek.api…
            </div>
          ) : (
            <p>Hit Send to fire the request.</p>
          )}
        </div>
      )}
    </section>
  );
}
export { ResponsePanel };
