import { useCallback, useEffect, useRef } from "react";
function Resizer({ onResize, min = 200, max = 520 }) {
  const dragging = useRef(false);
  const onMove = useCallback(
    (e) => {
      if (!dragging.current) return;
      const w = Math.min(max, Math.max(min, e.clientX - 56));
      onResize(w);
    },
    [min, max, onResize],
  );
  const onUp = useCallback(() => {
    dragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);
  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [onMove, onUp]);
  return (
    <div
      onMouseDown={() => {
        dragging.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
      }}
      className="w-1 shrink-0 cursor-col-resize bg-border hover:bg-primary transition-colors"
      role="separator"
      aria-orientation="vertical"
    />
  );
}
export { Resizer };
