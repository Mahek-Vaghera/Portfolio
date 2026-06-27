function humanize(key) {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
function isUrl(v) {
  return typeof v === "string" && /^https?:\/\//i.test(v);
}
function isEmail(v) {
  return typeof v === "string" && /^mailto:|^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function Scalar({ value }) {
  if (value === null || value === void 0)
    return <span className="text-muted-foreground italic">null</span>;
  if (typeof value === "boolean")
    return (
      <span
        className={
          value
            ? "text-[hsl(var(--success))]"
            : "text-[hsl(var(--destructive))]"
        }
      >
        {String(value)}
      </span>
    );
  if (typeof value === "number")
    return <span className="text-[hsl(var(--info))] font-mono">{value}</span>;
  if (isUrl(value))
    return (
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
        className="text-primary underline-offset-2 hover:underline break-all"
      >
        {value}
      </a>
    );
  if (isEmail(value)) {
    const href = value.startsWith("mailto:") ? value : `mailto:${value}`;
    return (
      <a
        href={href}
        className="text-primary underline-offset-2 hover:underline"
      >
        {value.replace(/^mailto:/, "")}
      </a>
    );
  }
  return <span className="text-foreground break-words">{String(value)}</span>;
}
function isFlatObject(v) {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  return Object.values(v).every(
    (x) => x === null || ["string", "number", "boolean"].includes(typeof x),
  );
}
function KeyValueTable({ data }) {
  const entries = Object.entries(data);
  const maxKey = entries.length
    ? Math.max(...entries.map(([k]) => humanize(k).length))
    : 0;
  return (
    <div className="font-mono text-[13px] leading-relaxed">
      {entries.map(([k, v]) => (
        <div key={k} className="flex gap-2">
          <span
            className="text-[hsl(var(--warning))] shrink-0"
            style={{
              minWidth: `${maxKey + 1}ch`,
            }}
          >
            {humanize(k)}
          </span>
          <span className="text-muted-foreground">:</span>
          <span className="min-w-0 flex-1">
            <Scalar value={v} />
          </span>
        </div>
      ))}
    </div>
  );
}
function Node({ value, depth = 0, path = "root" }) {
  if (value === null || typeof value !== "object")
    return <Scalar value={value} />;
  if (Array.isArray(value)) {
    if (value.length === 0)
      return <span className="text-muted-foreground italic">empty list</span>;
    const allPrimitive = value.every(
      (x) => x === null || ["string", "number", "boolean"].includes(typeof x),
    );
    if (allPrimitive) {
      return (
        <div className="flex flex-wrap gap-1.5">
          {value.map((item, i) => (
            <span
              key={`${path}[${i}]:${String(item)}`}
              className="px-2 py-0.5 rounded border border-border bg-card/60 text-xs font-mono"
            >
              <Scalar value={item} />
            </span>
          ))}
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {value.map((item, i) => (
          <section
            key={`${path}[${i}]`}
            className="border border-border/60 rounded-md bg-card/30"
          >
            <header className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/60 bg-secondary/30">
              Item {i + 1}
            </header>
            <div className="p-3">
              <Node value={item} depth={depth + 1} path={`${path}[${i}]`} />
            </div>
          </section>
        ))}
      </div>
    );
  }
  if (isFlatObject(value)) return <KeyValueTable data={value} />;
  const obj = value;
  const primitives = {};
  const nested = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === "object") nested.push([k, v]);
    else primitives[k] = v;
  }
  return (
    <div className="space-y-4">
      {Object.keys(primitives).length > 0 && (
        <KeyValueTable data={primitives} />
      )}
      {nested.map(([k, v]) => (
        <section
          key={`${path}.${k}`}
          className="border border-border/60 rounded-md bg-card/30"
        >
          <header className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-primary border-b border-border/60 bg-secondary/30">
            {humanize(k)}
          </header>
          <div className="p-3">
            <Node value={v} depth={depth + 1} path={`${path}.${k}`} />
          </div>
        </section>
      ))}
    </div>
  );
}
function WebView({ value }) {
  const title = pickTitle(value);
  return (
    <div className="p-5 bg-background">
      <div className="border border-border rounded-md mb-5 overflow-hidden">
        <div className="px-4 py-3 bg-card/60 border-b border-border flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            Output
          </div>
          <div className="text-[10px] text-muted-foreground font-mono">
            {title.subtitle}
          </div>
        </div>
        <div className="px-4 py-3">
          <h2 className="text-sm font-bold text-foreground font-mono">
            {title.heading}
          </h2>
        </div>
      </div>
      <Node value={value} path="response" />
      <div className="mt-6 text-[11px] text-muted-foreground font-mono">
        [Process exited with code 0]
      </div>
    </div>
  );
}
function pickTitle(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const o = value;
    const heading =
      (typeof o.name === "string" && o.name) ||
      (typeof o.title === "string" && o.title) ||
      (typeof o.school === "string" && o.school) ||
      (typeof o.org === "string" && o.org) ||
      "Response";
    const subtitle =
      (typeof o.role === "string" && o.role) ||
      (typeof o.degree === "string" && o.degree) ||
      (typeof o.tagline === "string" && o.tagline) ||
      "";
    return {
      heading,
      subtitle,
    };
  }
  if (Array.isArray(value))
    return {
      heading: `List \xB7 ${value.length} items`,
      subtitle: "",
    };
  return {
    heading: "Response",
    subtitle: "",
  };
}
export { WebView };
