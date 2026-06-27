import { cn } from "@/lib/utils";
function MethodPill({ method, className }) {
  const color =
    method === "GET"
      ? "text-[hsl(var(--info))]"
      : method === "POST"
        ? "text-[hsl(var(--warning))]"
        : method === "DELETE"
          ? "text-[hsl(var(--destructive))]"
          : method === "PUT" || method === "PATCH"
            ? "text-[hsl(var(--accent))]"
            : "text-muted-foreground";
  return (
    <span
      className={cn(
        "font-mono text-[10px] font-bold uppercase tracking-wider",
        color,
        className,
      )}
    >
      {method}
    </span>
  );
}
export { MethodPill };
