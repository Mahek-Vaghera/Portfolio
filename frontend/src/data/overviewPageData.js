import { profile, social, achievements } from "./portfolio";
import { allProjects } from "./projectsData";
const overviewStats = [
  {
    label: "CPI",
    value: "6.98",
    sub: "B.Tech ICT \xB7 DAU",
  },
  {
    label: "Problems solved",
    value: "550+",
    sub: "LeetCode \xB7 CF \xB7 CC",
  },
  {
    label: "LeetCode rating",
    value: String(
      achievements.find((a) => a.platform === "LeetCode")?.rating ?? "\u2014",
    ),
    sub: achievements.find((a) => a.platform === "LeetCode")?.badge ?? "",
  },
  {
    label: "Projects",
    value: String(allProjects.length),
    sub: "Built \xB7 Planned \xB7 Pitched",
  },
];
const overviewSocialChips = [
  {
    kind: "github",
    href: social.github,
    label: "GitHub",
  },
  {
    kind: "codolio",
    href: social.codolio,
    label: "Codolio",
  },
  {
    kind: "leetcode",
    href: social.leetcode,
    label: "LeetCode",
  },
  {
    kind: "codeforces",
    href: social.codeforces,
    label: "Codeforces",
  },
  {
    kind: "linkedin",
    href: social.linkedin,
    label: "LinkedIn",
  },
  {
    kind: "email",
    href: social.email,
    label: "Email",
  },
];
const overviewStarters = [
  {
    id: "get-profile",
    label: "GET /api/profile",
  },
  {
    id: "list-skills",
    label: "GET /api/skills",
  },
  {
    id: "list-cp-ratings",
    label: "GET /api/achievements/ratings",
  },
  {
    id: "post-message",
    label: "POST /api/contact",
  },
  {
    id: "delete-contact",
    label: "DELETE /api/contact",
  },
  {
    id: "post-feedback",
    label: "POST /api/feedback",
  },
  {
    id: "get-feedback",
    label: "GET /api/feedback",
  },
];
const overviewHeadline = {
  name: profile.name,
  role: profile.role,
  focus: profile.focus,
  bio: profile.bio,
  tagline: profile.tagline,
  location: profile.location,
};
export {
  overviewHeadline,
  overviewSocialChips,
  overviewStarters,
  overviewStats,
};
