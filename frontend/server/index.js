/**
 * Mahek Portfolio — reference Express backend.
 * - Brevo (transactional email)
 * - MongoDB (feedback + request history) with graceful in-memory fallback
 *
 * This file is intentionally self-contained. The static React app does not
 * need it to run; it only talks to it when VITE_API_BASE_URL is set.
 */
import "dotenv/config";
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const {
  PORT = 8787,
  CORS_ORIGIN = "*",
  OWNER_EMAIL,
  OWNER_NAME = "Mahek Vaghera",
  BREVO_API_KEY,
  BREVO_FROM_EMAIL,
  BREVO_FROM_NAME = "Mahek Vaghera",
  MONGODB_URI,
  MONGODB_DB = "mahek_portfolio",
} = process.env;

// -------------------- Mongo (with fallback) --------------------
let feedbackCol = null;
let historyCol = null;
const memory = { feedback: [], history: [] };

async function initMongo() {
  if (!MONGODB_URI) {
    console.warn("[mongo] MONGODB_URI not set — using in-memory store.");
    return;
  }
  try {
    const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 4000 });
    await client.connect();
    const db = client.db(MONGODB_DB);
    feedbackCol = db.collection("feedback");
    historyCol = db.collection("history");
    await feedbackCol.createIndex({ at: -1 });
    console.log("[mongo] connected:", MONGODB_DB);
  } catch (err) {
    console.warn("[mongo] connection failed, using in-memory store:", err.message);
  }
}

// -------------------- Brevo --------------------
async function sendBrevoEmail({ to, toName, subject, html }) {
  if (!BREVO_API_KEY || !BREVO_FROM_EMAIL) {
    console.warn("[brevo] not configured — skipping email to", to);
    return { skipped: true };
  }
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: BREVO_FROM_NAME, email: BREVO_FROM_EMAIL },
      to: [{ email: to, name: toName ?? to }],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo ${res.status}: ${text}`);
  }
  return res.json();
}

// -------------------- helpers --------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmail = (v) => typeof v === "string" && EMAIL_RE.test(v);

const maskEmail = (email) => {
  const [u, d] = email.split("@");
  if (!u || !d) return email;
  const head = u[0];
  const tail = u.length > 2 ? u.slice(-1) : "";
  return `${head}${"*".repeat(Math.max(1, u.length - head.length - tail.length))}${tail}@${d}`;
};

async function recordHistory(entry) {
  const doc = { ...entry, at: new Date().toISOString() };
  try {
    if (historyCol) await historyCol.insertOne(doc);
    else memory.history.unshift(doc);
  } catch (e) {
    console.warn("[history] write failed:", e.message);
  }
}

// -------------------- app --------------------
const app = express();
app.use(cors({ origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN.split(",") }));
app.use(express.json({ limit: "32kb" }));

app.get("/health", (_req, res) =>
  res.json({
    ok: true,
    mongo: !!feedbackCol,
    brevo: !!(BREVO_API_KEY && BREVO_FROM_EMAIL),
  }),
);

// POST /api/contact/message
app.post("/api/contact/message", async (req, res) => {
  const { name = "", email = "", message = "" } = req.body ?? {};
  if (!name.trim() || !email.trim())
    return res.status(400).json({
      error: "Bad Request",
      detail: "Both `name` and `email` are required.",
    });
  if (!isEmail(email))
    return res.status(400).json({ error: "Bad Request", detail: "Invalid email." });

  try {
    if (OWNER_EMAIL) {
      await sendBrevoEmail({
        to: OWNER_EMAIL,
        toName: OWNER_NAME,
        subject: `New portfolio message from ${name}`,
        html: `<h3>New message</h3>
               <p><b>From:</b> ${name} &lt;${email}&gt;</p>
               <p>${(message || "").replace(/\n/g, "<br>")}</p>`,
      });
    }
  } catch (e) {
    console.warn("[contact] email failed:", e.message);
  }
  await recordHistory({ kind: "contact", name, email });
  res.status(201).json({ ok: true, received_at: new Date().toISOString() });
});

// POST /api/feedback
app.post("/api/feedback", async (req, res) => {
  const { name = "Anonymous", email = "", message = "" } = req.body ?? {};
  if (!email.trim() || !message.trim())
    return res.status(400).json({
      error: "Bad Request",
      detail: "Both `email` and `message` are required.",
    });
  if (!isEmail(email))
    return res.status(400).json({ error: "Bad Request", detail: "Invalid email." });

  const doc = {
    name: name.trim() || "Anonymous",
    email: email.trim(),
    message: message.trim(),
    at: new Date().toISOString(),
  };
  try {
    if (feedbackCol) await feedbackCol.insertOne(doc);
    else memory.feedback.unshift(doc);
  } catch (e) {
    console.warn("[feedback] db write failed:", e.message);
    memory.feedback.unshift(doc);
  }

  try {
    await sendBrevoEmail({
      to: doc.email,
      toName: doc.name,
      subject: "Thanks for your feedback!",
      html: `<p>Hi ${doc.name},</p>
             <p>Thanks for taking the time to leave feedback on my portfolio —
             it genuinely means a lot. I read every message.</p>
             <p>— ${OWNER_NAME}</p>`,
    });
  } catch (e) {
    console.warn("[feedback] email failed:", e.message);
  }

  res.status(201).json({ ok: true, stored_at: doc.at });
});

// GET /api/feedback (emails masked)
app.get("/api/feedback", async (_req, res) => {
  let items = [];
  try {
    if (feedbackCol) {
      items = await feedbackCol.find({}, { sort: { at: -1 }, limit: 200 }).toArray();
    } else {
      items = memory.feedback;
    }
  } catch (e) {
    console.warn("[feedback] read failed:", e.message);
    items = memory.feedback;
  }
  res.json({
    count: items.length,
    feedback: items.map((f) => ({
      name: f.name,
      email: maskEmail(f.email),
      message: f.message,
      at: f.at,
    })),
  });
});

// -------------------- boot --------------------
initMongo().finally(() => {
  app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`);
  });
});
