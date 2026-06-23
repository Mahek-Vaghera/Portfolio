const activeProjects = [
  {
    id: "bidsphere",
    name: "BidSphere",
    tagline: "Real-time online auction platform",
    status: "live",
    year: 2025,
    role: "Full-stack / Backend Lead",
    stack: ["Node.js", "Express", "MongoDB", "JWT", "REST", "Nodemailer"],
    description:
      "Full-stack online auction system with secure JWT authentication, role-based access control (user/admin), real-time bidding with AutoBid, automated email notifications, and a complete UPI-based payment workflow.",
    problem:
      "Existing auction sites are slow, lack auto-bidding and have clunky payment flows. BidSphere fixes that with a clean REST API, real-time bid updates and end-to-end UPI payments.",
    features: [
      "RESTful APIs with strict role-based access control",
      "AutoBid engine with configurable max-bid ceilings",
      "Email notifications on bid events and auction close",
      "End-to-end UPI payment workflow",
      "Admin dashboard for auction lifecycle",
    ],
    apis: [
      {
        method: "POST",
        path: "/auth/signup",
        purpose: "Register a bidder",
      },
      {
        method: "POST",
        path: "/auth/login",
        purpose: "Issue JWT",
      },
      {
        method: "GET",
        path: "/auctions",
        purpose: "List live auctions",
      },
      {
        method: "POST",
        path: "/auctions/:id/bid",
        purpose: "Place a bid",
      },
      {
        method: "POST",
        path: "/auctions/:id/autobid",
        purpose: "Configure AutoBid",
      },
      {
        method: "POST",
        path: "/payments/upi",
        purpose: "Initiate UPI payment",
      },
    ],
    links: {
      github: "https://github.com/Mahek-Vaghera/bidsphere",
    },
    files: [],
  },
  {
    id: "folder-cleaner",
    name: "Folder Cleaner",
    tagline: "Smart filesystem janitor in C++",
    status: "shipped",
    year: 2024,
    role: "Solo developer",
    stack: ["C++", "STL", "File I/O"],
    description:
      "Efficient CLI utility that ingests TXT/CSV file metadata and removes redundant, old, empty, duplicate, or rarely-accessed files.",
    problem:
      "Personal machines fill up with redundant, old and duplicate files. A scriptable, fast cleaner saves hours of manual work.",
    features: [
      "Duplicate detection via metadata + content hashing",
      "Schedulable cleaning policies",
      "Extension-based auto-organization",
      "Keyword-targeted bulk deletion",
      "Lexicographic sorting and reporting",
    ],
    apis: [
      {
        method: "GET",
        path: "/scan",
        purpose: "Scan a directory",
      },
      {
        method: "POST",
        path: "/clean",
        purpose: "Run a cleaning policy",
      },
      {
        method: "POST",
        path: "/schedule",
        purpose: "Schedule recurring clean",
      },
    ],
    links: {
      github: "https://github.com/Mahek-Vaghera",
    },
    files: [],
  },
  // {
  //   id: "project-x",
  //   name: "Project X",
  //   tagline: "Larger backend system in progress",
  //   status: "wip",
  //   year: 2026,
  //   role: "Architect & developer",
  //   stack: ["Node.js", "PostgreSQL", "Redis", "Docker", "BullMQ"],
  //   description: "A bigger backend effort designed for scale from day one. Caching layer, queue workers, and observability built in. Details soon.",
  //   problem: "Most side projects ignore scale, observability and durability. Project X is an honest attempt at production-grade backend hygiene.",
  //   features: [
  //     "Designed for horizontal scale",
  //     "Redis caching + BullMQ background workers",
  //     "Structured logging and metrics",
  //     "Containerized dev + prod parity"
  //   ],
  //   apis: [
  //     { method: "GET", path: "/healthz", purpose: "Health probe" },
  //     { method: "GET", path: "/metrics", purpose: "Prometheus metrics" }
  //   ],
  //   links: {},
  //   files: []
  // }
];
const futureIdeas = [
  // {
  //   id: "idea-devjournal",
  //   name: "DevJournal",
  //   tagline: "Git-aware daily engineering journal",
  //   status: "wip",
  //   year: 2026,
  //   role: "Planned",
  //   stack: ["Node.js", "PostgreSQL", "OpenAI"],
  //   description: "A CLI + web app that reads your local git activity each day and auto-generates a markdown engineering journal you can edit and publish.",
  //   problem: "Engineers forget what they shipped. Annual reviews and resumes suffer. DevJournal turns commits into a reviewable timeline.",
  //   features: [
  //     "Local git scan with privacy-first sync",
  //     "AI summary of the day's work",
  //     "Public/private entries with tags",
  //     "Export to markdown / PDF"
  //   ],
  //   apis: [
  //     { method: "POST", path: "/journal/sync", purpose: "Pull today's commits" },
  //     { method: "GET", path: "/journal/:date", purpose: "Read entry" }
  //   ],
  //   links: {},
  //   files: []
  // },
  // {
  //   id: "idea-apiforge",
  //   name: "APIForge",
  //   tagline: "Spec-first mock API generator",
  //   status: "wip",
  //   year: 2026,
  //   role: "Planned",
  //   stack: ["Node.js", "Express", "OpenAPI"],
  //   description: "Paste an OpenAPI spec, get a hosted mock backend in seconds with realistic faker data and editable response rules.",
  //   problem: "Frontend teams wait days for backend stubs. APIForge collapses that to minutes.",
  //   features: [
  //     "OpenAPI 3.x ingestion",
  //     "Faker-powered realistic data",
  //     "Per-route latency & error injection",
  //     "Shareable mock URLs"
  //   ],
  //   apis: [{ method: "POST", path: "/mocks", purpose: "Create a mock from spec" }],
  //   links: {},
  //   files: []
  // }
];
const businessIdeas = [
  // {
  //   id: "biz-campus-tiffin",
  //   name: "CampusTiffin",
  //   tagline: "Subscription home-cooked meals for hostelers",
  //   status: "wip",
  //   year: 2026,
  //   role: "Founder (idea stage)",
  //   stack: ["Operations", "Mobile app", "Logistics"],
  //   description: "A weekly subscription that connects vetted home-kitchens with hostel students for fresh, affordable, home-cooked meals delivered to campus.",
  //   problem: "Mess food is monotonous and unhealthy; ordering daily is expensive. A subscription model fills the gap.",
  //   features: [
  //     "Weekly rotating menu",
  //     "Vetted home-kitchens with hygiene scoring",
  //     "Skip / pause anytime",
  //     "Hostel-floor batch delivery to cut cost"
  //   ],
  //   apis: [],
  //   links: {},
  //   files: []
  // }
];
const allProjects = [...activeProjects, ...futureIdeas, ...businessIdeas];
const projectCategories = [
  {
    id: "active",
    label: "Active Projects",
    items: activeProjects,
  },
  {
    id: "future",
    label: "Future Ideas",
    items: futureIdeas,
  },
  {
    id: "business",
    label: "Business Ideas",
    items: businessIdeas,
  },
];
export {
  activeProjects,
  allProjects,
  businessIdeas,
  futureIdeas,
  projectCategories,
};
