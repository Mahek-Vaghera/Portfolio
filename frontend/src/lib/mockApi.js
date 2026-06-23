import { allEndpoints } from "@/data";
import { hasBackend, remoteFetch } from "./apiClient";
const STATUS_TEXT = {
  200: "OK",
  201: "Created",
  400: "Bad Request",
  404: "Not Found",
  422: "Unprocessable Entity",
  500: "Internal Server Error",
};
function byteSize(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value ?? "")).length;
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(2)} KB`;
}
async function executeMock(spec, pathParams, queryParams, body) {
  const start = performance.now();
  let source = "mock";
  let status = 200;
  let respBody;
  if (spec.remote && hasBackend) {
    const url = buildResolvedUrl(spec, pathParams, queryParams);
    const remote = await remoteFetch(url, {
      method: spec.method,
      body:
        spec.method === "GET" || body == null ? void 0 : JSON.stringify(body),
    });
    if (remote) {
      const timeMs2 = Math.round(performance.now() - start);
      return {
        status: remote.status,
        statusText:
          STATUS_TEXT[remote.status] ?? (remote.status < 400 ? "OK" : "Error"),
        timeMs: timeMs2,
        size: byteSize(remote.body),
        headers: {
          "content-type": "application/json; charset=utf-8",
          "x-powered-by": "Mahek-API/1.0 (remote)",
          "x-request-id": crypto.randomUUID(),
        },
        body: remote.body,
        source: "remote",
      };
    }
    source = "remote-fallback";
  }
  await new Promise((r) => setTimeout(r, 180 + Math.random() * 220));
  try {
    if (typeof spec.response === "function") {
      const out = spec.response({
        pathParams,
        queryParams,
        body,
      });
      status = out?.status ?? 200;
      respBody = out?.body;
    } else {
      respBody = spec.response;
    }
  } catch (e) {
    status = 500;
    respBody = {
      error: e.message,
    };
  }
  const timeMs = Math.round(performance.now() - start);
  return {
    status,
    statusText: STATUS_TEXT[status] ?? (status < 400 ? "OK" : "Error"),
    timeMs,
    size: byteSize(respBody),
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-powered-by": "Mahek-API/1.0",
      "cache-control": "public, max-age=60",
      "x-request-id": crypto.randomUUID(),
    },
    body: respBody,
    source,
  };
}
function buildResolvedUrl(spec, pathParams, queryParams) {
  let p = spec.path;
  for (const [k, v] of Object.entries(pathParams)) {
    p = p.replace(`:${k}`, encodeURIComponent(v || `:${k}`));
  }
  const qs = Object.entries(queryParams)
    .filter(([, v]) => v !== "" && v != null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return qs ? `${p}?${qs}` : p;
}
function extractPathParamKeys(path) {
  return Array.from(path.matchAll(/:([a-zA-Z0-9_]+)/g)).map((m) => m[1]);
}
function defaultParams(spec) {
  const pathParams = {};
  const queryParams = {};
  for (const key of extractPathParamKeys(spec.path)) pathParams[key] = "";
  for (const p of spec.params ?? []) {
    if (p.in === "path") pathParams[p.key] = p.value ?? "";
    else queryParams[p.key] = p.value ?? "";
  }
  return {
    pathParams,
    queryParams,
  };
}
function findEndpoint(id) {
  return allEndpoints.find((e) => e.id === id);
}
export {
  buildResolvedUrl,
  defaultParams,
  executeMock,
  extractPathParamKeys,
  findEndpoint,
};
