"use client";

import { useCallback, useState, type ReactNode } from "react";
import { BRAND_CSS, brandOf, KoherentAsk, themeVars } from "./brand";
import { shipletsAtStart, type ShipletMap, type ShipletStatus } from "./data";
import { ScenarioContext } from "./derive";
import { ToastContext, ToastView, type Toast } from "./Feedback";
import { Login } from "./Login";
import { Developers } from "./More";
import { TeamConsole } from "./Team";
import { ProjectPage, Report, RuleDetail, RulesPage, type RuleStatus } from "./Network";
import { TeamMini } from "./People";
import { AskContext, AskDrawer, RequestDetail, RequestsPage, requestsFor, type About, type Req } from "./Requests";
import { scenarios, type BrandId } from "./scenarios";
import { Billing, Home, InvoiceDetail, ShipmentDetail, Shipments } from "./Ship";
import { ShipletDetail, ShipletsPage } from "./Shiplets";
import { SitesPage } from "./Sites";
import { Shell, type View } from "./ui";

// ── /dashboard ────────────────────────────────────────────────────────────────
// One ShipTime app, the way Shopify Plus works on top of Shopify: everyone gets
// the same pages, and ShipTime One switches more on (warehouses on a map,
// tested rules, go-live projects with their meetings, a named team, the
// control tower on Home). Customers never see "ShipTime One": those accounts
// open as Koherent, in its own colours (Oct 22 L10). It opens on a sign-in
// with demo accounts, so the same app can be shown both ways. Any page can open "ask about this", which lands in
// Requests. Every action confirms what happened in a toast. Sample data for
// made-up companies; it doesn't touch the real app.

export default function Console() {
  const [brand, setBrand] = useState<BrandId | null>(null);
  const [shiplets, setShiplets] = useState<ShipletMap>({});
  const [rules, setRules] = useState<Record<string, RuleStatus>>({});
  const [requests, setRequests] = useState<Req[]>([]);
  const [asking, setAsking] = useState<About | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [requestId, setRequestId] = useState("");
  const [view, setView] = useState<View>("home");
  const [shipmentId, setShipmentId] = useState("SHP-48213");
  const [ruleId, setRuleId] = useState("");
  const [shipletId, setShipletId] = useState("");
  const [sandbox, setSandbox] = useState(false);
  const [staff, setStaff] = useState(false); // signed in as the account team

  const go = useCallback((v: View) => { setView(v); setToast(null); window.scrollTo(0, 0); }, []);
  const signIn = (b: BrandId) => {
    const sc = scenarios[b];
    setBrand(b);
    setShiplets({ ...shipletsAtStart[b] });
    setRules(Object.fromEntries(sc.rules.map((r) => [r.id, r.status])));
    setRequests(requestsFor(sc.tier === "Koherent", (sc.sites[1] ?? sc.sites[0]).name.split(",")[0], sc.account.user.name));
    setView("home");
    window.scrollTo(0, 0);
  };
  // The account team opens a customer's own pages, at the right place.
  const viewAs = (b: BrandId, v: View = "home", ids?: { request?: string }) => { signIn(b); if (ids?.request) setRequestId(ids.request); setView(v); };
  const setShiplet = (id: string, s: ShipletStatus) => setShiplets((m) => ({ ...m, [id]: s }));
  const closeToast = useCallback(() => setToast(null), []);
  const send = (about: About, text: string) => {
    const sc = scenarios[brand!];
    const one = sc.tier === "Koherent";
    const id = `R-${1049 + requests.length}`;
    const promise = one ? "First reply by 12:42 pm" : "Reply by tomorrow, 10:42 am";
    // The title is the first sentence, cut at a word if it runs long.
    const first = text.split(/(?<=[.?!])\s/)[0].replace(/\.$/, "");
    const title = first.length > 70 ? `${first.slice(0, 67).replace(/\s+\S*$/, "")}…` : first;
    setRequests((r) => [{ id, title, about, state: "Submitted", owner: one ? "Priya Shah" : undefined, promise, created: "Today, 10:42 am", thread: [{ who: sc.account.user.name, at: "Today, 10:42 am", text }] }, ...r]);
    setAsking(null);
    setToast({ text: one ? "Sent to Priya. First reply by 12:42 pm." : "Sent to support. Reply by tomorrow morning.", action: { label: "View", onClick: () => { setRequestId(id); go("request"); } } });
  };

  const toasts = (children: ReactNode) => (
    <ToastContext.Provider value={setToast}>
      {children}
      {toast && <ToastView toast={toast} onClose={closeToast} />}
    </ToastContext.Provider>
  );
  if (!brand) return toasts(
    <div style={themeVars("shiptime")}>
      {staff ? <TeamConsole onViewAs={viewAs} onSignOut={() => setStaff(false)} /> : <Login onSignIn={signIn} onTeam={() => setStaff(true)} />}
    </div>,
  );
  const sc = scenarios[brand];
  const one = sc.tier === "Koherent";
  const req = requests.find((r) => r.id === requestId);

  return toasts(
    <ScenarioContext.Provider value={sc}>
      <div data-brand={brandOf(sc.tier)} style={themeVars(brandOf(sc.tier))}>
        <style>{BRAND_CSS}</style>
      <AskContext.Provider value={setAsking}>
        <Shell key={brand} view={view} go={go} sandbox={sandbox} setSandbox={setSandbox} onSignOut={() => setBrand(null)}
          banner={staff ? <div className="flex h-9 items-center justify-between gap-3 bg-[#1A1B25] px-4 text-[13px] text-white" style={{ fontFamily: "system-ui, sans-serif" }}><span className="truncate">Viewing {sc.account.name} as Priya Shah, account team. {sc.account.user.name.split(" ")[0]} sees the same pages, without this bar.</span><button type="button" onClick={() => setBrand(null)} className="shrink-0 font-semibold hover:underline">Back to your day</button></div> : undefined} extra={one ? <TeamMini onMessage={() => setAsking({ kind: "General", label: "Message to your team" })} /> : <KoherentAsk onPreview={() => signIn("reach")} />}>
          {view === "home" && <Home go={go} shiplets={shiplets} setShiplet={setShiplet} />}
          {view === "shipments" && <Shipments returnsLive={shiplets.returns === "Live"} open={(id) => { setShipmentId(id); go("shipment"); }} />}
          {view === "shipment" && <ShipmentDetail id={shipmentId} back={() => go("shipments")} go={go} trackingLive={shiplets.tracking === "Live"} onTrackingOn={() => setShiplet("tracking", "Live")} />}
          {view === "billing" && <Billing open={() => go("invoice")} />}
          {view === "invoice" && <InvoiceDetail back={() => go("billing")} />}
          {view === "shiplets" && <ShipletsPage shiplets={shiplets} setShiplet={setShiplet} open={(id) => { setShipletId(id); go("shiplet"); }} />}
          {view === "shiplet" && <ShipletDetail key={shipletId} id={shipletId} shiplets={shiplets} setShiplet={setShiplet} back={() => go("shiplets")} go={go} />}
          {view === "requests" && <RequestsPage requests={requests} open={(id) => { setRequestId(id); go("request"); }} />}
          {view === "request" && req && <RequestDetail key={req.id} req={req} back={() => go("requests")} go={go} />}
          {one && view === "network" && <SitesPage go={go} />}
          {one && view === "rules" && <RulesPage statuses={rules} open={(id) => { setRuleId(id); go("rule"); }} />}
          {one && view === "rule" && <RuleDetail key={ruleId} id={ruleId} statuses={rules} setStatus={(s) => setRules((m) => ({ ...m, [ruleId]: s }))} back={() => go("rules")} />}
          {one && view === "golive" && <ProjectPage />}
          {one && view === "report" && <Report go={go} />}
          {view === "developers" && <Developers />}
        </Shell>
        {asking && <AskDrawer about={asking} onClose={() => setAsking(null)} onSend={(t) => send(asking, t)} />}
      </AskContext.Provider>
      </div>
    </ScenarioContext.Provider>
  );
}
