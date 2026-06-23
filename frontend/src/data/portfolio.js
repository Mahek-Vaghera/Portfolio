import {
  addFeedback,
  isValidEmail,
  maskEmail,
  readFeedback,
} from "@/lib/feedbackStore";
const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "admin@example.com";
const adminPassword =
  import.meta.env.VITE_ADMIN_PASSWORD || "StrongPassword123";
const dedupeFeedback = (items) => {
  const seen = new Set();

  return items.filter((item) => {
    const key = [
      item.name ?? "",
      item.email ?? "",
      item.feedback ?? item.message ?? "",
    ].join("\u0001");

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
const profile = {
  name: "Mahek Vaghera",
  // handle: "mahekvaghera",
  // role: "Backend Developer",
  focus: "Node.js \xB7 APIs \xB7 DSA \xB7 Database",
  tagline: "I build the part of the internet you don't see.",
  bio: "Backend developer who loves clean APIs, well-shaped data, and elegant algorithms. Currently building larger systems while sharpening DSA fundamentals.",
  location: "Gandhinagar, Gujarat, India",
  email: "mahekv4306@gmail.com",
  available_for: ["Internships","Software-Engineer role", "Backend roles", "Open-source collabs"],
  // currently_building: "A larger Node.js + PostgreSQL + Redis system",
  currently_learning: ["System Design", "DSA", "Distributed Systems"],
};
const social = {
  github: "https://github.com/Mahek-Vaghera",
  linkedin: "https://www.linkedin.com/in/mahek-vaghera-a1ab89301/",
  leetcode: "https://leetcode.com/u/mahekvaghera",
  codolio: "https://codolio.com/profile/mahekvaghera",
  codeforces: "https://codeforces.com/profile/mahekvaghera",
  codechef: "https://www.codechef.com/users/mahekvaghera",
  email: "mailto:mahekv4306@gmail.com",
  resume: "https://github.com/Mahek-Vaghera",
};
const education = [
  {
    id: "dau",
    school: "Dhirubhai Ambani University (formerly DA-IICT)",
    degree: "B.Tech, Information & Communication Technology",
    score: "CPI: 6.98",
    period: "2023 \u2014 Present",
    location: "Gandhinagar, Gujarat",
  },
  {
    id: "alpha",
    school: "Alpha High School (GHSEB)",
    degree: "12th Standard",
    score: "69.69%",
    period: "2022 \u2014 2023",
    location: "Junagadh, Gujarat",
  },
  {
    id: "sardar",
    school: "Shree Sardar Patel Kanya Chhatralay (GSEB)",
    degree: "10th Standard",
    score: "86.66%",
    period: "2020 \u2014 2021",
    location: "Junagadh, Gujarat",
  },
];
const experience = [
  {
    id: "bolbala-2024",
    org: "Shree Bolbala Charitable Trust",
    role: "Rural Internship Intern",
    period: "Dec 2024",
    location: "Rajkot, Gujarat",
    points: [
      "Completed rural internship supporting social welfare programs.",
      "Provided food and clothing to underprivileged people; distributed food to stray and domestic animals.",
      "Contributed to 40+ field works focused on people, animals, and environmental welfare.",
    ],
  },
];
const skills = {
  languages: ["C", "C++"],
  frameworks: ["Node.js", "Express.js", "HTML", "CSS", "Tailwind CSS"],
  databases: ["MongoDB", "MySQL", "PostgreSQL", "Redis"],
  tools: ["Git", "GitHub", "Postman", "VS Code", "pgAdmin"],
  coursework: [
    "DSA",
    "DAA",
    "DBMS",
    "OOPS",
    "Operating Systems",
    "Computer Networks",
  ],
  soft_skills: ["Team Collaboration", "Problem Solving"],
  interests: ["Web Development", "DSA", "System Design"],
};
const achievements = [
  {
    platform: "LeetCode",
    rating: 1618,
    badge: "Top 21.07%",
    handle: "mahekvaghera",
    url: social.leetcode,
  },
  {
    platform: "Codeforces",
    rating: 1030,
    badge: "Pupil",
    handle: "mahekvaghera",
    url: social.codeforces,
  },
  {
    platform: "CodeChef",
    rating: 1390,
    badge: "2\u2605",
    handle: "mahekvaghera",
    url: social.codechef,
  },
];
const certifications = [
  // {
  //   id: "cert-dummy-1",
  //   name: "[REPLACE] Backend Development Bootcamp",
  //   issuer: "Coursera",
  //   year: 2025,
  //   credential: "https://coursera.org/verify/REPLACE"
  // },
  // {
  //   id: "cert-dummy-2",
  //   name: "[REPLACE] Database Fundamentals",
  //   issuer: "MongoDB University",
  //   year: 2024,
  //   credential: "https://learn.mongodb.com/REPLACE"
  // }
];
const hobbies = [
  "Thriller Movies & Series",
  "Watching Self-Improvement Videos",
  "Learning about Brain Rewiring",
  "Inspiring People's Podcasts",
  "Logic Puzzles & Mind Map Duels"
];
const languagesSpoken = [
  {
    name: "English",
    level: "Professional",
  },
  {
    name: "Hindi",
    level: "Native",
  },
  {
    name: "Gujarati",
    level: "Native",
  },
];
const contact = {
  email: profile.email,
  github: social.github,
  linkedin: social.linkedin,
  preferred_contact: "email",
  response_time: "within 24h",
  open_to: ["Internships", "Backend roles"],
};
import { allProjects as _allProjects } from "./projectsData";
const projects = _allProjects;
const journey = [
  {
  year: "Now",
  title: "Open to Opportunities",
  kind: "current",
  detail: "Looking for software engineering opportunities to learn, build, and create impactful products.",
}
];
const environments = [
  {
    id: "prod",
    name: "Production",
    variables: [
      {
        key: "baseUrl",
        value: "https://mahek.api/v1",
      },
      {
        key: "version",
        value: "1.0.0",
      },
      {
        key: "region",
        value: "ap-south-1",
      },
    ],
  },
  {
    id: "dev",
    name: "Local Dev",
    variables: [
      {
        key: "baseUrl",
        value: "http://localhost:8080",
      },
      {
        key: "version",
        value: "1.0.0-dev",
      },
      {
        key: "region",
        value: "localhost",
      },
    ],
  },
];
const sections = [
  {
    id: "about",
    name: "About Me",
    endpoints: [
      {
        id: "get-profile",
        name: "Get profile",
        method: "GET",
        path: "/api/profile",
        description: "Returns Mahek's basic profile, bio and current focus.",
        response: () => ({
          body: profile,
        }),
      }
      // {
      //   id: "get-tagline",
      //   name: "Get tagline",
      //   method: "GET",
      //   path: "/api/profile/tagline",
      //   description: "Just the one-liner.",
      //   response: () => ({
      //     body: {
      //       tagline: profile.tagline,
      //     },
      //   }),
      // },
      // {
      //   id: "get-availability",
      //   name: "Get availability",
      //   method: "GET",
      //   path: "/api/profile/availability",
      //   description: "What Mahek is currently open to.",
      //   response: () => ({
      //     body: {
      //       available_for: profile.available_for,
      //       currently_building: profile.currently_building,
      //       currently_learning: profile.currently_learning,
      //     },
      //   }),
      // },
    ],
  },
  {
    id: "education",
    name: "Education",
    endpoints: [
      {
        id: "list-education",
        name: "List education",
        method: "GET",
        path: "/api/education",
        description: "All schools + university.",
        response: () => ({
          body: {
            count: education.length,
            education,
          },
        }),
      }
      // {
      //   id: "get-current-edu",
      //   name: "Get current school",
      //   method: "GET",
      //   path: "/api/education/current",
      //   description: "What Mahek is studying right now.",
      //   response: () => ({
      //     body: education[0],
      //   }),
      // },
      // {
      //   id: "get-edu-by-id",
      //   name: "Get school by id",
      //   method: "GET",
      //   path: "/api/education/:id",
      //   description: "Lookup one entry (dau | alpha | sardar).",
      //   params: [
      //     {
      //       key: "id",
      //       value: "dau",
      //       description: "school id",
      //       in: "path",
      //     },
      //   ],
      //   response: ({ pathParams }) => {
      //     const e = education.find((x) => x.id === pathParams.id);
      //     return e
      //       ? {
      //           body: e,
      //         }
      //       : {
      //           status: 404,
      //           body: {
      //             error: "School not found",
      //           },
      //         };
      //   },
      // },
    ],
  },
  {
    id: "experience",
    name: "Experience",
    endpoints: [
      {
        id: "list-experience",
        name: "List experience",
        method: "GET",
        path: "/api/experience",
        description: "Work / internships / volunteering.",
        response: () => ({
          body: {
            count: experience.length,
            experience,
          },
        }),
      }
      // {
      //   id: "get-latest-experience",
      //   name: "Get latest role",
      //   method: "GET",
      //   path: "/api/experience/latest",
      //   description: "Most recent role.",
      //   response: () => ({
      //     body: experience[0],
      //   }),
      // },
    ],
  },
  {
    id: "skills",
    name: "Skills",
    endpoints: [
      {
        id: "list-skills",
        name: "List all skills",
        method: "GET",
        path: "/api/skills",
        description:
          "Languages, frameworks, databases, tools, coursework, interests.",
        response: () => ({
          body: skills,
        }),
      }
      // {
      //   id: "list-skills-by-cat",
      //   name: "Skills by category",
      //   method: "GET",
      //   path: "/api/skills/:category",
      //   description:
      //     "Filter by category (languages | frameworks | databases | tools | coursework | interests).",
      //   params: [
      //     {
      //       key: "category",
      //       value: "languages",
      //       description: "category",
      //       in: "path",
      //     },
      //   ],
      //   response: ({ pathParams }) => {
      //     const cat = pathParams.category;
      //     const v = skills[cat];
      //     return v
      //       ? {
      //           body: {
      //             category: cat,
      //             items: v,
      //           },
      //         }
      //       : {
      //           status: 404,
      //           body: {
      //             error: `Unknown category: ${cat}`,
      //           },
      //         };
      //   },
      // },
    ],
  },
  {
    id: "achievements",
    name: "Achievements",
    endpoints: [
      {
        id: "list-cp-ratings",
        name: "List CP ratings",
        method: "GET",
        path: "/api/achievements/ratings",
        description: "Competitive programming ratings.",
        response: () => ({
          body: {
            count: achievements.length,
            ratings: achievements,
          },
        }),
      }
      // {
      //   id: "get-best-rating",
      //   name: "Get best rating",
      //   method: "GET",
      //   path: "/api/achievements/best",
      //   description: "Highest CP rating.",
      //   response: () => ({
      //     body: [...achievements].sort((a, b) => b.rating - a.rating)[0],
      //   }),
      // },
    ],
  },
  // {
  //   id: "certifications",
  //   name: "Certifications",
  //   endpoints: [
  //     {
  //       id: "list-certs",
  //       name: "List certifications",
  //       method: "GET",
  //       path: "/api/certifications",
  //       description:
  //         "All certifications. (Dummy data \u2014 replace in portfolio.js)",
  //       response: () => ({
  //         body: {
  //           count: certifications.length,
  //           certifications,
  //         },
  //       }),
  //     },
  //   ],
  // },
  {
    id: "hobbies",
    name: "Hobbies & Languages",
    endpoints: [
      {
        id: "list-hobbies",
        name: "List hobbies",
        method: "GET",
        path: "/api/hobbies",
        description: "Things Mahek enjoys outside code.",
        response: () => ({
          body: {
            hobbies,
          },
        }),
      },
      {
        id: "list-languages",
        name: "Spoken languages",
        method: "GET",
        path: "/api/languages",
        description: "Languages Mahek speaks.",
        response: () => ({
          body: {
            languages: languagesSpoken,
          },
        }),
      },
    ],
  },
  {
    id: "contact",
    name: "Contact",
    endpoints: [
      {
        id: "get-contact",
        name: "List contact requests",
        method: "GET",
        path: "/api/contact",
        description:
          "List saved contact requests. Admin credentials must be provided as query parameters.",
        remote: true,
        params: [
          {
            key: "email",
            value: adminEmail,
            description: "Admin email address",
            in: "query",
          },
          {
            key: "password",
            value: adminPassword,
            description: "Admin password",
            in: "query",
          },
        ],
        response: () => ({
          body: {
            success: true,
            contacts: [
              {
                _id: "CONTACT_ID",
                id: 1,
                name: "Vatsal",
                email: "vatsal@gmail.com",
                subject: "Portfolio Inquiry",
                message: "Hi Mahek, I'd love your work",
                createdAt: "2026-06-30T00:00:00.000Z",
                updatedAt: "2026-06-30T00:00:00.000Z",
              },
            ],
          },
        }),
      },
      {
        id: "post-message",
        name: "Send a message",
        method: "POST",
        path: "/api/contact",
        description:
          "Send Mahek a message. Requires { name, email, subject, message }.",
        remote: true,
        body: {
          name: "Your name",
          email: "you@example.com",
          subject: "Portfolio Inquiry",
          message: "Hi Mahek, I'd love to chat about...",
        },
        response: ({ body }) => {
          const b = body ?? {};
          const name = (b.name ?? "").trim();
          const email = (b.email ?? "").trim();
          const subject = (b.subject ?? "").trim();
          const message = (b.message ?? "").trim();
          if (!name || !email || !subject || !message) {
            return {
              status: 400,
              body: {
                error: "Bad Request",
                detail: "All fields are required.",
                missing: [
                  !name && "name",
                  !email && "email",
                  !subject && "subject",
                  !message && "message",
                ].filter(Boolean),
              },
            };
          }
          if (!isValidEmail(email)) {
            return {
              status: 400,
              body: {
                error: "Bad Request",
                detail: "`email` is not a valid address.",
              },
            };
          }
          return {
            status: 201,
            body: {
              success: true,
              message: "Email sent successfully.",
            },
          };
        },
      },
      {
        id: "delete-contact",
        name: "Delete contact",
        method: "DELETE",
        path: "/api/contact",
        description:
          "Delete a contact by id (numeric ID, e.g. 1, or MongoDB _id). Requires { id, password } in the JSON body.",
        remote: true,
        body: {
          id: "1",
          password: adminPassword,
        },
        response: ({ body }) => {
          const b = body ?? {};
          const id = String(b.id ?? "").trim();
          const password = String(b.password ?? "").trim();

          if (!id) {
            return {
              status: 400,
              body: {
                success: false,
                message: "Contact id is required",
              },
            };
          }

          if (!password) {
            return {
              status: 400,
              body: {
                success: false,
                message: "Password is required",
              },
            };
          }

          return {
            status: 200,
            body: {
              success: true,
              message: "Contact deleted successfully.",
            },
          };
        },
      },
      {
        id: "post-feedback",
        name: "Submit feedback",
        method: "POST",
        path: "/api/feedback",
        description:
          "Leave feedback. Requires { name, email, feedback }. Rating is optional.",
        remote: true,
        body: {
          name: "Your name",
          email: "you@example.com",
          feedback: "Loved the portfolio!",
        },
        response: ({ body }) => {
          const b = body ?? {};
          const name = (b.name ?? "").trim();
          const email = (b.email ?? "").trim();
          const feedback = (b.feedback ?? "").trim();
          if (!name || !email || !feedback) {
            return {
              status: 400,
              body: {
                error: "Bad Request",
                detail: "`name`, `email`, and `feedback` are required.",
                missing: [!name && "name", !email && "email", !feedback && "feedback"].filter(
                  Boolean,
                ),
              },
            };
          }
          if (!isValidEmail(email)) {
            return {
              status: 400,
              body: {
                error: "Bad Request",
                detail: "`email` is not a valid address.",
              },
            };
          }
          return {
            status: 201,
            body: {
              success: true,
              message: "Feedback submitted successfully.",
            },
          };
        },
      },
      {
        id: "get-feedback",
        name: "List feedback",
        method: "GET",
        path: "/api/feedback",
        description:
          "All feedback submitted so far. Email addresses are masked in the response.",
        remote: true,
        response: () => {
          const items = dedupeFeedback(readFeedback()).map((f, idx, arr) => ({
            _id: f._id ?? f.id,
            id: arr.length - idx,
            name: f.name,
            email: maskEmail(f.email),
            rating: f.rating ?? null,
            feedback: f.feedback ?? f.message ?? "",
            createdAt: f.createdAt ?? f.at,
          }));
          return {
            body: {
              success: true,
              feedback: items,
            },
          };
        },
      },
      {
        id: "delete-feedback",
        name: "Delete feedback",
        method: "DELETE",
        path: "/api/feedback",
        description:
          "Delete feedback by id (numeric ID, e.g. 1, or MongoDB _id). Requires { id, password } in the JSON body.",
        remote: true,
        body: {
          id: "1",
          password: adminPassword,
        },
        response: ({ body }) => {
          const b = body ?? {};
          const id = String(b.id ?? "").trim();
          const password = String(b.password ?? "").trim();

          if (!id) {
            return {
              status: 400,
              body: {
                success: false,
                message: "Feedback id is required",
              },
            };
          }

          if (!password) {
            return {
              status: 400,
              body: {
                success: false,
                message: "Password is required",
              },
            };
          }

          return {
            status: 200,
            body: {
              success: true,
              message: "Feedback deleted successfully.",
            },
          };
        },
      },
      {
        id: "get-resume",
        name: "Get resume link",
        method: "GET",
        path: "/api/resume",
        description: "Download Mahek's resume.",
        response: () => ({
          body: {
            url: social.resume,
            note: "Ask via email for the latest PDF.",
          },
        }),
      },
    ],
  },
];
const allEndpoints = sections.flatMap((s) => s.endpoints);
export {
  achievements,
  allEndpoints,
  certifications,
  contact,
  education,
  environments,
  experience,
  hobbies,
  journey,
  languagesSpoken,
  profile,
  projects,
  sections,
  skills,
  social,
};
