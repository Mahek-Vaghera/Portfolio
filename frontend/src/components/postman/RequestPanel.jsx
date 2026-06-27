import { useMemo, useState } from "react";
import { Plus, Send, Star, Trash2 } from "lucide-react";
import { buildResolvedUrl, extractPathParamKeys } from "@/lib/mockApi";
import { MethodPill } from "./MethodPill";
import { cn } from "@/lib/utils";
function RequestPanel({ tab, spec, onChange, onSend, onSaveToggle, saved }) {
  const pathKeys = useMemo(() => extractPathParamKeys(spec.path), [spec.path]);
  const initial = spec.body ? "body" : spec.method === "POST" || spec.method === "PUT" ? "body" : "params";
  const [sub, setSub] = useState(initial);
  const resolvedUrl = buildResolvedUrl(spec, tab.pathParams, tab.queryParams);
  const setQueryParam = (key, value) =>
    onChange({
      queryParams: {
        ...tab.queryParams,
        [key]: value,
      },
    });
  const removeQueryParam = (key) => {
    const next = {
      ...tab.queryParams,
    };
    delete next[key];
    onChange({
      queryParams: next,
    });
  };
  const addQueryParam = () => {
    const base = "key";
    let i = 1;
    let k = base;
    while (k in tab.queryParams) {
      i++;
      k = `${base}${i}`;
    }
    onChange({
      queryParams: {
        ...tab.queryParams,
        [k]: "",
      },
    });
  };
  const setPathParam = (key, value) =>
    onChange({
      pathParams: {
        ...tab.pathParams,
        [key]: value,
      },
    });
  return (
    <section className="border-b border-border bg-background flex flex-col">
      <div className="p-3 border-b border-border flex items-center gap-2">
        <div className="flex items-center gap-2 px-2.5 py-2 rounded-md bg-secondary border border-border min-w-0 flex-1">
          <MethodPill method={spec.method} className="text-xs" />
          <span className="text-xs text-foreground truncate flex-1 font-mono">
            {resolvedUrl}
          </span>
        </div>
        <button
          onClick={onSend}
          disabled={tab.loading}
          className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
          {tab.loading ? "Sending\u2026" : "Send"}
        </button>
        <button
          onClick={onSaveToggle}
          className={cn(
            "h-9 w-9 grid place-items-center rounded-md border border-border hover:bg-secondary transition-colors",
            saved && "text-[hsl(var(--warning))]",
          )}
          title={saved ? "Unsave" : "Save request"}
        >
          <Star className={cn("h-3.5 w-3.5", saved && "fill-current")} />
        </button>
      </div>
      <div className="px-3 border-b border-border flex items-center gap-1 text-[11px]">
        {[
          {
            id: "params",
            label: "Params",
          },
          {
            id: "body",
            label: "Body",
          },
          {
            id: "headers",
            label: "Headers",
          },
          {
            id: "docs",
            label: "Docs",
          },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setSub(s.id)}
            className={cn(
              "px-3 py-2 border-b-2 -mb-px transition-colors",
              sub === s.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="p-3 max-h-[40vh] overflow-y-auto scrollbar-thin">
        {sub === "params" && (
          <div className="space-y-3">
            {pathKeys.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                  Path variables
                </h4>
                <div className="space-y-1">
                  {pathKeys.map((k) => (
                    <div
                      key={k}
                      className="grid grid-cols-[120px_1fr] gap-2 items-center"
                    >
                      <code className="text-xs text-[hsl(var(--syntax-var))]">
                        :{k}
                      </code>
                      <input
                        value={tab.pathParams[k] ?? ""}
                        onChange={(e) => setPathParam(k, e.target.value)}
                        placeholder={`enter ${k}`}
                        className="bg-secondary border border-border rounded px-2 py-1 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Query params
                </h4>
                <button
                  onClick={addQueryParam}
                  className="text-[11px] text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> add
                </button>
              </div>
              {Object.keys(tab.queryParams).length === 0 ? (
                <p className="text-[11px] text-muted-foreground">
                  No query params.
                </p>
              ) : (
                <div className="space-y-1">
                  {Object.entries(tab.queryParams).map(([k, v]) => (
                    <div
                      key={k}
                      className="grid grid-cols-[120px_1fr_auto] gap-2 items-center"
                    >
                      <input
                        value={k}
                        onChange={(e) => {
                          const next = {
                            ...tab.queryParams,
                          };
                          delete next[k];
                          next[e.target.value] = v;
                          onChange({
                            queryParams: next,
                          });
                        }}
                        className="bg-secondary border border-border rounded px-2 py-1 text-xs focus:outline-none focus:border-primary text-[hsl(var(--syntax-var))]"
                      />
                      <input
                        value={String(v ?? "")}
                        onChange={(e) => setQueryParam(k, e.target.value)}
                        placeholder="value"
                        className="bg-secondary border border-border rounded px-2 py-1 text-xs focus:outline-none focus:border-primary"
                      />
                      <button
                        onClick={() => removeQueryParam(k)}
                        className="h-7 w-7 grid place-items-center rounded hover:bg-secondary text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {sub === "body" && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Raw · JSON
              </h4>
              {spec.body && (
                <button
                  onClick={() =>
                    onChange({
                      body: JSON.stringify(spec.body, null, 2),
                    })
                  }
                  className="text-[11px] text-muted-foreground hover:text-foreground"
                >
                  reset to example
                </button>
              )}
            </div>
            <textarea
              value={tab.body}
              onChange={(e) =>
                onChange({
                  body: e.target.value,
                })
              }
              placeholder={
                spec.method === "GET"
                  ? "// GET requests usually have no body"
                  : "{}"
              }
              spellCheck={false}
              className="w-full h-48 bg-secondary border border-border rounded-md p-2 text-xs font-mono focus:outline-none focus:border-primary text-[hsl(var(--syntax-string))] scrollbar-thin"
            />
          </div>
        )}
        {sub === "headers" && (
          <div className="space-y-1">
            <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
              Auto headers
            </h4>
            {[
              ["Accept", "application/json"],
              ["Content-Type", "application/json"],
              ["User-Agent", "Mahek-Portfolio/1.0"],
              ["X-Mock", "true"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="grid grid-cols-[180px_1fr] gap-2 text-xs"
              >
                <span className="text-[hsl(var(--syntax-var))]">{k}</span>
                <span className="text-[hsl(var(--syntax-string))]">{v}</span>
              </div>
            ))}
          </div>
        )}
        {sub === "docs" && (
          <div className="space-y-3 text-xs leading-relaxed">
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Endpoint
              </h4>
              <code className="text-foreground">
                <MethodPill method={spec.method} className="mr-2" />
                {spec.path}
              </code>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Description
              </h4>
              <p className="text-foreground/90">{spec.description}</p>
            </div>
            {spec.params && spec.params.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                  Parameters
                </h4>
                <ul className="space-y-1">
                  {spec.params.map((p) => (
                    <li key={p.key} className="flex gap-2">
                      <code className="text-[hsl(var(--syntax-var))] w-24 shrink-0">
                        {p.key}
                      </code>
                      <span className="text-muted-foreground">
                        ({p.in}) {p.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
export { RequestPanel };
