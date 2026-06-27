import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
function isPrimitive(v) {
  return v === null || typeof v !== "object";
}
function Primitive({ value }) {
  if (value === null)
    return <span className="text-[hsl(var(--syntax-keyword))]">null</span>;
  if (typeof value === "boolean")
    return (
      <span className="text-[hsl(var(--syntax-keyword))]">{String(value)}</span>
    );
  if (typeof value === "number")
    return <span className="text-[hsl(var(--syntax-number))]">{value}</span>;
  if (typeof value === "string") {
    const isUrl = /^https?:\/\//.test(value);
    if (isUrl) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="text-[hsl(var(--syntax-string))] underline decoration-dotted underline-offset-2 hover:text-primary"
        >
          "{value}"
        </a>
      );
    }
    return <span className="text-[hsl(var(--syntax-string))]">"{value}"</span>;
  }
  return <span>{String(value)}</span>;
}
function Node({ name, value, depth, isLast, path = "root" }) {
  const [open, setOpen] = useState(depth < 3);
  if (isPrimitive(value)) {
    return (
      <div
        className="font-mono text-xs leading-6"
        style={{
          paddingLeft: depth * 14,
        }}
      >
        {name !== void 0 && (
          <Fragment>
            <span className="text-[hsl(var(--syntax-var))]">"{name}"</span>
            <span className="text-muted-foreground">: </span>
          </Fragment>
        )}
        <Primitive value={value} />
        {!isLast && <span className="text-muted-foreground">,</span>}
      </div>
    );
  }
  const isArray = Array.isArray(value);
  const entries = isArray ? value.map((v, i) => [i, v]) : Object.entries(value);
  return (
    <div className="font-mono text-xs leading-6">
      <div
        className="flex items-start gap-1 cursor-pointer hover:bg-secondary/40 rounded"
        style={{
          paddingLeft: depth * 14,
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-muted-foreground mt-0.5">
          {open ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </span>
        {name !== void 0 && (
          <Fragment>
            <span className="text-[hsl(var(--syntax-var))]">"{name}"</span>
            <span className="text-muted-foreground">: </span>
          </Fragment>
        )}
        <span className="text-muted-foreground">{isArray ? "[" : "{"}</span>
        {!open && (
          <Fragment>
            <span className="text-muted-foreground italic ml-1">
              {entries.length} {entries.length === 1 ? "item" : "items"}
            </span>
            <span className="text-muted-foreground ml-1">
              {isArray ? "]" : "}"}
              {!isLast ? "," : ""}
            </span>
          </Fragment>
        )}
      </div>
      {open && (
        <Fragment>
          {entries.map(([k, v], idx) => (
            <Node
              key={`${path}.${String(k)}`}
              name={k}
              value={v}
              depth={depth + 1}
              isLast={idx === entries.length - 1}
              path={`${path}.${String(k)}`}
            />
          ))}
          <div
            className="text-muted-foreground"
            style={{
              paddingLeft: depth * 14 + 14,
            }}
          >
            {isArray ? "]" : "}"}
            {!isLast && <span>,</span>}
          </div>
        </Fragment>
      )}
    </div>
  );
}
function JsonView({ value }) {
  return (
    <div className="font-mono">
      <Node value={value} depth={0} isLast path="root" />
    </div>
  );
}
export { JsonView };
