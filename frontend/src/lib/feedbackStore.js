const KEY = "mahek:feedback";
function getFeedbackText(item) {
  return String(item?.message ?? item?.feedback ?? "");
}
function maskEmail(email) {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const head = user.slice(0, 1);
  const tail = user.length > 2 ? user.slice(-1) : "";
  return `${head}${"*".repeat(Math.max(1, user.length - head.length - tail.length))}${tail}@${domain}`;
}
function readFeedback() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];

    const seen = new Set();
    return arr.filter((item) => {
      const key = [item?.name ?? "", item?.email ?? "", getFeedbackText(item)].join(
        "\u0001",
      );

      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch {
    return [];
  }
}
function addFeedback(entry) {
  const full = {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    ...entry,
  };
  const key = [full.name ?? "", full.email ?? "", getFeedbackText(full)].join(
    "\u0001",
  );
  const list = readFeedback().filter(
    (item) =>
      [item?.name ?? "", item?.email ?? "", getFeedbackText(item)].join(
        "\u0001",
      ) !== key,
  );
  list.unshift(full);
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 200)));
  } catch {}
  return full;
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (e) => EMAIL_RE.test(e);
export { addFeedback, isValidEmail, maskEmail, readFeedback };
