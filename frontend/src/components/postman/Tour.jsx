import { Fragment, useCallback, useEffect, useLayoutEffect, useState } from "react";
import { tourSteps, TOUR_VERSION } from "@/data/tourData";
const STORAGE_KEY = `portfolio-tour-${TOUR_VERSION}`;
function Tour() {
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(false);
  const [rect, setRect] = useState(null);
  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const t = setTimeout(() => setActive(true), 400);
      return () => clearTimeout(t);
    }
  }, []);
  useEffect(() => {
    const handler = () => {
      setStep(0);
      setActive(true);
    };
    window.addEventListener("portfolio:replay-tour", handler);
    return () => window.removeEventListener("portfolio:replay-tour", handler);
  }, []);
  useLayoutEffect(() => {
    if (!active) return;
    const s2 = tourSteps[step];
    if (!s2) return;
    const el = document.querySelector(s2.target);
    if (!el) {
      setRect(null);
      return;
    }
    setRect(el.getBoundingClientRect());
    const onResize = () => setRect(el.getBoundingClientRect());
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [step, active]);
  const finish = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "1");
    setActive(false);
  }, []);
  const next = useCallback(
    () => setStep((s2) => (s2 < tourSteps.length - 1 ? s2 + 1 : (finish(), s2))),
    [finish],
  );
  const prev = useCallback(() => setStep((s2) => Math.max(0, s2 - 1)), []);
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "Escape") {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, finish, next, prev]);
  if (!active) return null;
  const s = tourSteps[step];
  if (!s) return null;
  const PAD = 6;
  const clamped = rect
    ? (() => {
        const top = Math.max(2, rect.top - PAD);
        const left = Math.max(2, rect.left - PAD);
        const bottomLimit = window.innerHeight - 2;
        const rightLimit = window.innerWidth - 2;
        const height = Math.min(rect.height + PAD * 2, bottomLimit - top);
        const width = Math.min(rect.width + PAD * 2, rightLimit - left);
        return {
          top,
          left,
          width,
          height,
        };
      })()
    : null;
  const pop = computePopoverPosition(rect, s.side ?? "right");
  const dimCls =
    "absolute bg-background/25 backdrop-blur-[1.5px] pointer-events-auto";
  const W = typeof window !== "undefined" ? window.innerWidth : 0;
  const H = typeof window !== "undefined" ? window.innerHeight : 0;
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {clamped ? (
        <Fragment>
          <div
            className={dimCls}
            style={{
              top: 0,
              left: 0,
              width: W,
              height: clamped.top,
            }}
            onClick={finish}
          />
          <div
            className={dimCls}
            style={{
              top: clamped.top + clamped.height,
              left: 0,
              width: W,
              height: Math.max(0, H - (clamped.top + clamped.height)),
            }}
            onClick={finish}
          />
          <div
            className={dimCls}
            style={{
              top: clamped.top,
              left: 0,
              width: clamped.left,
              height: clamped.height,
            }}
            onClick={finish}
          />
          <div
            className={dimCls}
            style={{
              top: clamped.top,
              left: clamped.left + clamped.width,
              width: Math.max(0, W - (clamped.left + clamped.width)),
              height: clamped.height,
            }}
            onClick={finish}
          />
          <div
            className="absolute rounded-md ring-2 ring-primary pointer-events-none transition-all"
            style={{
              top: clamped.top,
              left: clamped.left,
              width: clamped.width,
              height: clamped.height,
              boxShadow:
                "0 0 0 2px hsl(var(--primary) / 0.35), 0 0 24px hsl(var(--primary) / 0.45)",
            }}
          />
        </Fragment>
      ) : (
        <div
          className={dimCls}
          style={{
            inset: 0,
          }}
          onClick={finish}
        />
      )}
      <div
        className="absolute pointer-events-auto w-72 rounded-lg border border-border bg-popover p-4 shadow-card"
        style={pop}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Tour · {step + 1}/{tourSteps.length}
          </span>
          <button
            onClick={finish}
            className="text-[11px] text-muted-foreground hover:text-foreground"
          >
            Skip
          </button>
        </div>
        <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
          {s.body}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-[10px] text-muted-foreground">
            ← / → to navigate · Esc to skip
          </span>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={prev}
                className="h-7 px-2.5 rounded-md border border-border text-xs hover:bg-secondary"
              >
                Back
              </button>
            )}
            <button
              onClick={next}
              className="h-7 px-3 rounded-md bg-primary text-primary-foreground text-xs font-bold hover:opacity-90"
            >
              {step === tourSteps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function computePopoverPosition(rect, side) {
  const W = 288;
  const H = 180;
  const GAP = 14;
  if (!rect) {
    return {
      top: window.innerHeight / 2 - H / 2,
      left: window.innerWidth / 2 - W / 2,
    };
  }
  let top = rect.top;
  let left = rect.right + GAP;
  if (side === "left") {
    left = rect.left - W - GAP;
  } else if (side === "top") {
    top = rect.top - H - GAP;
    left = rect.left;
  } else if (side === "bottom") {
    top = rect.bottom + GAP;
    left = rect.left;
  }
  left = Math.max(8, Math.min(window.innerWidth - W - 8, left));
  top = Math.max(8, Math.min(window.innerHeight - H - 8, top));
  return {
    top,
    left,
    width: W,
  };
}
export { Tour };
