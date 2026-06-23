import { journey as rawJourney } from "./portfolio";
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const journeyCards = [...rawJourney]
  .sort((a, b) => b.year.localeCompare(a.year))
  .map((ev) => ({
    ...ev,
    id: `${ev.year}-${slug(ev.title)}`,
  }));
const journeyMeta = {
  title: "My Journey",
  subtitle:
    "Click any milestone \u2014 the featured card updates with a smooth animation.",
};
export { journeyCards, journeyMeta };
