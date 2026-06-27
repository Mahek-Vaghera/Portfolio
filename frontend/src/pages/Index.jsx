import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildResolvedUrl,
  defaultParams,
  executeMock,
  findEndpoint,
} from "@/lib/mockApi";
import { projects } from "@/data";
import { journeyCards } from "@/data/journeyData";
import { IconRail } from "@/components/postman/IconRail";
import { ResumeView } from "@/components/postman/views/ResumeView";
import { HistoryView } from "@/components/postman/views/HistoryView";
import { ProjectsView } from "@/components/postman/views/ProjectsView";
import { FlowsView } from "@/components/postman/views/FlowsView";
import { Resizer } from "@/components/postman/Resizer";
import { TabBar } from "@/components/postman/TabBar";
import { RequestPanel } from "@/components/postman/RequestPanel";
import { ResponsePanel } from "@/components/postman/ResponsePanel";
import { ProjectPanel } from "@/components/postman/ProjectPanel";
import { OverviewPanel } from "@/components/postman/OverviewPanel";
import { JourneyPanel } from "@/components/postman/JourneyPanel";
import { Tour } from "@/components/postman/Tour";
import { useHistoryStore } from "@/hooks/useHistoryStore";
function buildRequestHeaders(spec, body) {
  const headers = {
    accept: "application/json",
    "content-type": "application/json",
    "x-mock": "true",
  };

  if (spec.method === "GET" && body != null) {
    headers["x-http-method-override"] = "GET";
  }

  return headers;
}
const newEndpointTab = (spec) => {
  const { pathParams, queryParams } = defaultParams(spec);
  return {
    id: crypto.randomUUID(),
    kind: "endpoint",
    endpointId: spec.id,
    pathParams,
    queryParams,
    body: spec.body ? JSON.stringify(spec.body, null, 2) : "",
  };
};
const newProjectTab = (p) => ({
  id: crypto.randomUUID(),
  kind: "project",
  projectId: p.id,
});
const newOverviewTab = () => ({
  id: crypto.randomUUID(),
  kind: "overview",
});
const newJourneyTab = () => ({
  id: crypto.randomUUID(),
  kind: "journey",
});
const Index = () => {
  const [rail, setRail] = useState("resume");
  const [panelWidth, setPanelWidth] = useState(288);
  const [tabs, setTabs] = useState(() => [newOverviewTab()]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [selectedJourneyId, setSelectedJourneyId] = useState(null);
  const { history, saved, pushHistory, toggleSaved, isSaved, clearHistory } =
    useHistoryStore();
  useEffect(() => {
    if (tabs.length > 0 && !activeTabId) setActiveTabId(tabs[0].id);
  }, [tabs, activeTabId]);
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? null;
  const openEndpoint = (spec) => {
    const existing = tabs.find(
      (t2) => t2.kind === "endpoint" && t2.endpointId === spec.id,
    );
    if (existing) return setActiveTabId(existing.id);
    const t = newEndpointTab(spec);
    setTabs((prev) => [...prev, t]);
    setActiveTabId(t.id);
  };
  const openEndpointById = (id) => {
    const spec = findEndpoint(id);
    if (spec) openEndpoint(spec);
  };
  const openProject = (p) => {
    const existing = tabs.find(
      (t2) => t2.kind === "project" && t2.projectId === p.id,
    );
    if (existing) return setActiveTabId(existing.id);
    const t = newProjectTab(p);
    setTabs((prev) => [...prev, t]);
    setActiveTabId(t.id);
  };
  const openProjectById = (id) => {
    const p = projects.find((x) => x.id === id);
    if (p) openProject(p);
  };
  const openJourney = (card) => {
    const target =
      card ??
      journeyCards.find((c) => c.id === selectedJourneyId) ??
      journeyCards[0];
    if (target) setSelectedJourneyId(target.id);
    const existing = tabs.find((t2) => t2.kind === "journey");
    if (existing) return setActiveTabId(existing.id);
    const t = newJourneyTab();
    setTabs((prev) => [...prev, t]);
    setActiveTabId(t.id);
  };
  const selectJourney = (card) => {
    setSelectedJourneyId(card.id);
    openJourney(card);
  };
  const updateTab = (id, patch) => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === id && t.kind === "endpoint"
          ? {
              ...t,
              ...patch,
            }
          : t,
      ),
    );
  };
  const closeTab = useCallback((id) => {
    setTabs((prev) => {
      const target = prev.find((t) => t.id === id);
      if (!target || target.kind === "overview") return prev;
      const idx = prev.findIndex((t) => t.id === id);
      const next = prev.filter((t) => t.id !== id);
      if (activeTabId === id) {
        const fallback = next[idx] ?? next[idx - 1] ?? null;
        setActiveTabId(fallback?.id ?? null);
      }
      return next;
    });
  }, [activeTabId]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey && (e.key === "w" || e.key === "W")) {
        e.preventDefault();
        if (activeTabId) closeTab(activeTabId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeTabId, closeTab]);
  const sendRequest = async (tab, spec) => {
    updateTab(tab.id, {
      loading: true,
    });
    let parsedBody = void 0;
    if (tab.body && tab.body.trim()) {
      try {
        parsedBody = JSON.parse(tab.body);
      } catch {
        updateTab(tab.id, {
          loading: false,
          response: {
            status: 400,
            statusText: "Bad Request",
            timeMs: 1,
            size: "0 B",
            headers: {
              "content-type": "application/json",
            },
            body: {
              error: "Request body is not valid JSON",
            },
          },
        });
        return;
      }
    }
    const res = await executeMock(
      spec,
      tab.pathParams,
      tab.queryParams,
      parsedBody,
    );
    const resolvedUrl = buildResolvedUrl(
      spec,
      tab.pathParams,
      tab.queryParams,
    );
    const requestHeaders = buildRequestHeaders(spec, parsedBody);
    updateTab(tab.id, {
      loading: false,
      response: res,
    });
    pushHistory({
      id: crypto.randomUUID(),
      endpointId: spec.id,
      method: spec.method,
      url: resolvedUrl,
      pathParams: tab.pathParams,
      queryParams: tab.queryParams,
      headers: requestHeaders,
      body: parsedBody ?? null,
      status: res.status,
      timeMs: res.timeMs,
      at: Date.now(),
      request: {
        method: spec.method,
        url: resolvedUrl,
        pathParams: tab.pathParams,
        queryParams: tab.queryParams,
        headers: requestHeaders,
        body: parsedBody ?? null,
      },
    });
  };
  const activeEndpointId =
    activeTab?.kind === "endpoint" ? activeTab.endpointId : null;
  const activeProjectId =
    activeTab?.kind === "project" ? activeTab.projectId : null;
  const activeSpec = useMemo(
    () => (activeEndpointId ? findEndpoint(activeEndpointId) : void 0),
    [activeEndpointId],
  );
  const activeProject = useMemo(
    () =>
      activeProjectId ? projects.find((p) => p.id === activeProjectId) : void 0,
    [activeProjectId],
  );
  const clearHistoryAndRequests = useCallback(() => {
    clearHistory();
    setTabs((prev) => {
      const next = prev.filter((tab) => tab.kind !== "endpoint");
      if (next.length === 0) {
        const overview = newOverviewTab();
        setActiveTabId(overview.id);
        return [overview];
      }

      if (activeTabId && !next.some((tab) => tab.id === activeTabId)) {
        setActiveTabId(next[0].id);
      }

      return next;
    });
  }, [activeTabId, clearHistory]);
  return (
    <div className="h-screen w-full flex bg-background text-foreground font-mono overflow-hidden">
      <IconRail active={rail} onSelect={setRail} onOpenJourney={openJourney} />
      <aside
        style={{
          width: panelWidth,
        }}
        className="shrink-0 border-r border-border bg-card/40 flex flex-col min-h-0"
      >
        {rail === "resume" && (
          <ResumeView
            activeEndpointId={activeEndpointId}
            onOpen={openEndpoint}
          />
        )}
        {rail === "history" && (
          <HistoryView
            history={history}
            saved={saved}
            onOpenById={openEndpointById}
            onClear={clearHistoryAndRequests}
          />
        )}
        {rail === "projects" && (
          <ProjectsView
            activeProjectId={activeProjectId}
            onOpen={openProject}
          />
        )}
        {rail === "journey" && (
          <FlowsView
            selectedJourneyId={selectedJourneyId}
            onSelectJourney={selectJourney}
          />
        )}
      </aside>
      <Resizer onResize={setPanelWidth} />
      <main className="flex-1 min-w-0 flex flex-col">
        <TabBar
          tabs={tabs}
          activeId={activeTabId}
          onSelect={setActiveTabId}
          onClose={closeTab}
        />
        {activeTab?.kind === "endpoint" && activeSpec && (
          <div className="flex-1 min-h-0 flex flex-col">
            <RequestPanel
              tab={activeTab}
              spec={activeSpec}
              onChange={(patch) => updateTab(activeTab.id, patch)}
              onSend={() => sendRequest(activeTab, activeSpec)}
              onSaveToggle={() => toggleSaved(activeSpec.id)}
              saved={isSaved(activeSpec.id)}
            />
            <ResponsePanel
              response={activeTab.response}
              loading={!!activeTab.loading}
            />
          </div>
        )}
        {activeTab?.kind === "project" && activeProject && (
          <ProjectPanel project={activeProject} />
        )}
        {activeTab?.kind === "overview" && (
          <OverviewPanel
            onPickEndpoint={openEndpointById}
            onPickProject={openProjectById}
          />
        )}
        {activeTab?.kind === "journey" && (
          <JourneyPanel
            selectedId={selectedJourneyId ?? journeyCards[0]?.id ?? null}
            onSelect={(c) => setSelectedJourneyId(c.id)}
          />
        )}
        {!activeTab && (
          <div className="flex-1 grid place-items-center text-xs text-muted-foreground">
            Open a request from the sidebar to start.
          </div>
        )}
      </main>
      <Tour />
    </div>
  );
};
export default Index;
