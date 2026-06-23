const API_BASE = import.meta.env.VITE_API_BASE_URL;
const hasBackend = !!API_BASE;
async function remoteFetch(path, init) {
  if (!API_BASE) return null;
  try {
    const hasBody = init?.body != null && init?.body !== "";
    const method = String(init?.method ?? "GET").toUpperCase();
    const useMethodOverride = method === "GET" && hasBody;
    const res = await fetch(`${API_BASE.replace(/\/$/, "")}${path}`, {
      method: useMethodOverride ? "POST" : method,
      ...init,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-mock": "true",
        ...(useMethodOverride
          ? {
              "x-http-method-override": "GET",
            }
          : {}),
        ...(init?.headers ?? {}),
      },
    });
    let body = null;
    const txt = await res.text();
    if (txt) {
      try {
        body = JSON.parse(txt);
      } catch {
        body = txt;
      }
    }
    return {
      status: res.status,
      body,
    };
  } catch {
    return null;
  }
}
export { API_BASE, hasBackend, remoteFetch };
