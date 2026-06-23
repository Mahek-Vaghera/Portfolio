import { useCallback, useEffect, useState } from "react";
const HISTORY_KEY = "mahek.api.history.v1";
const SAVED_KEY = "mahek.api.saved.v1";
const HISTORY_LIMIT = 30;
const HISTORY_STORAGE_KEYS = [HISTORY_KEY];

function isPlainObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function stableCopy(value) {
  if (Array.isArray(value)) return value.map(stableCopy);
  if (!isPlainObject(value)) return value;

  return Object.keys(value)
    .sort()
    .reduce((acc, key) => {
      acc[key] = stableCopy(value[key]);
      return acc;
    }, {});
}

function buildRequestKey(request) {
  return JSON.stringify(stableCopy(request ?? {}));
}

function normalizeHistoryItem(entry) {
  const request = entry.request ?? {
    method: entry.method ?? "",
    url: entry.url ?? "",
    pathParams: entry.pathParams ?? {},
    queryParams: entry.queryParams ?? {},
    headers: entry.headers ?? {},
    body: entry.body ?? null,
  };

  return {
    ...entry,
    request,
    requestKey: entry.requestKey ?? buildRequestKey(request),
    at: entry.at ?? Date.now(),
  };
}

function readHistory() {
  const items = read(HISTORY_KEY, []);
  return Array.isArray(items) ? items.map(normalizeHistoryItem) : [];
}
function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
function useHistoryStore() {
  const [history, setHistory] = useState(() => readHistory());
  const [saved, setSaved] = useState(() => read(SAVED_KEY, []));
  useEffect(() => write(HISTORY_KEY, history), [history]);
  useEffect(() => write(SAVED_KEY, saved), [saved]);
  const pushHistory = useCallback((entry) => {
    setHistory((prev) => {
      const nextEntry = normalizeHistoryItem(entry);
      const nextHistory = prev.filter(
        (item) => item.requestKey !== nextEntry.requestKey,
      );

      return [nextEntry, ...nextHistory].slice(0, HISTORY_LIMIT);
    });
  }, []);
  const clearHistory = useCallback(() => {
    setHistory([]);

    for (const key of HISTORY_STORAGE_KEYS) {
      try {
        window.localStorage.removeItem(key);
      } catch {}
      try {
        window.sessionStorage.removeItem(key);
      } catch {}
    }
  }, []);
  const toggleSaved = useCallback((endpointId) => {
    setSaved((prev) =>
      prev.includes(endpointId)
        ? prev.filter((x) => x !== endpointId)
        : [...prev, endpointId],
    );
  }, []);
  const isSaved = useCallback(
    (endpointId) => saved.includes(endpointId),
    [saved],
  );
  return {
    history,
    saved,
    pushHistory,
    clearHistory,
    toggleSaved,
    isSaved,
  };
}
export { useHistoryStore };
