import { Header } from "./ResumeView";
import {
  GraduationCap,
  Briefcase,
  Rocket,
  Trophy,
  School,
  Sparkles,
} from "lucide-react";
import { journeyCards } from "@/data/journeyData";
import { cn } from "@/lib/utils";
const iconFor = (kind) => {
  switch (kind) {
    case "school":
      return School;
    case "college":
      return GraduationCap;
    case "intern":
      return Briefcase;
    case "project":
      return Rocket;
    case "cp":
      return Trophy;
    default:
      return Sparkles;
  }
};
function FlowsView({ selectedJourneyId, onSelectJourney }) {
  return (
    <div className="flex flex-col h-full">
      <Header title="Journey" subtitle="My timeline so far" />
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
        <ol className="relative border-l border-border ml-3 space-y-1">
          {journeyCards.map((ev) => {
            const Icon = iconFor(ev.kind);
            const isCurrent = ev.kind === "current";
            const isActive = ev.id === selectedJourneyId;
            return (
              <li key={ev.id}>
                <button
                  onClick={() => onSelectJourney(ev)}
                  className={cn(
                    "w-full text-left pl-5 pr-2 py-2 rounded-md relative transition-colors",
                    isActive
                      ? "bg-primary/15 ring-1 ring-primary/40"
                      : "hover:bg-secondary/60",
                  )}
                >
                  <span
                    className={cn(
                      "absolute -left-[10px] top-3 h-4 w-4 rounded-full grid place-items-center border-2 border-background",
                      isCurrent
                        ? "bg-primary text-primary-foreground animate-pulse-dot"
                        : isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground",
                    )}
                  >
                    <Icon className="h-2.5 w-2.5" />
                  </span>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {ev.year} · {ev.org}
                  </div>
                  <div className="text-xs font-semibold text-foreground">
                    {ev.title}
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
export { FlowsView };
