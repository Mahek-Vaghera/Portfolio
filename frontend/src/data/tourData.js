const TOUR_VERSION = "v1";
const tourSteps = [
  {
    target: "[data-tour='overview-tab']",
    title: "Welcome \u{1F44B}",
    body: "This portfolio is built like Postman. The Overview tab is always here \u2014 it can't be closed.",
    side: "bottom",
  },
  {
    target: "[data-tour='rail-resume']",
    title: "Resume \u2192 REST API",
    body: "Each part of my resume is a GET endpoint. Click one in the sidebar to fire a fake request and see the response.",
    side: "right",
  },
  {
    target: "[data-tour='rail-projects']",
    title: "Projects",
    body: "Three folders: Active Projects (shipped/in progress), Future Ideas, and Business Ideas. Click any to open its detail tab.",
    side: "right",
  },
  {
    target: "[data-tour='rail-flows']",
    title: "Journey",
    body: "My timeline as a flow \u2014 school \u2192 college \u2192 projects \u2192 today.",
    side: "right",
  },
  {
    target: "[data-tour='rail-history']",
    title: "History & Saved",
    body: "Every request you fire is logged here, and you can star endpoints to save them.",
    side: "right",
  },
  {
    target: "[data-tour='socials']",
    title: "Find me online",
    body: "GitHub, Codolio, LeetCode, LinkedIn, email, and resume \u2014 all pinned to the rail.",
    side: "right",
  },
  {
    target: "[data-tour='tabbar']",
    title: "Tabs",
    body: "Open as many requests as you like. Press Alt + W to close the active tab quickly.",
    side: "bottom",
  },
];
export { TOUR_VERSION, tourSteps };
