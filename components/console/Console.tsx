"use client";

import { useCallback, useState } from "react";
import { shipletsAtStart, type ShipletMap, type ShipletStatus } from "./data";
import { ScenarioContext } from "./derive";
import { Login } from "./Login";
import { Developers } from "./More";
import { ProjectPage, Report, RuleDetail, RulesPage, type RuleStatus } from "./Network";
import { TeamMini } from "./People";
import { AskContext, AskDrawer, RequestsPage, requestsFor, type About, type Req } from "./Requests";
import { scenarios, type BrandId } from "./scenarios";
import { Billing, Home, InvoiceDetail, ShipmentDetail, Shipments } from "./Ship";
import { ShipletDetail, ShipletsPage } from "./Shiplets";
import { SitesPage } from "./Sites";
import { Shell, type View } from "./ui";

// ── /dashboard ────────────────────────────────────────────────────────────────
// One ShipTime app, the way Shopify Plus works on top of Shopify: everyone gets
// the same pages, and ShipTime One switches more on (sites on a map, tested
// rules, go-live projects with their meetings, a named team, the control tower
// on Home). It opens on a sign-in with demo accounts, so the same app can be
// shown both ways. Any page can open "ask about this", which lands in
// Requests. Sample data for made-up companies; it doesn't touch the real app.

export default function Console() {
  const [brand, setBrand] = useState<BrandId | null>(null);
  const [shiplets, setShiplets] = useState<ShipletMap>({});
  const [rules, setRules] = useState<Record<string, RuleStatus>>({});
  const [requests, setRequests] = useState<Req[]>([]);
  const [asking, setAsking] = useState<About | null>(null);
  const [view, setView] = useState<View>("home");
  const [shipmentId, setShipmentId] = useState("SHP-48213");
  const [ruleId, setRuleId] = useState("");
  const [shipletId, setShipletId] = useState("");
  const [sandbox, setSandbox] = useState(false);

  const go = useCallback((v: View) => { setView(v); window.scrollTo(0, 0); }, []);
  const signIn = (b: BrandId) => {
    const sc = scenarios[b];
    setBrand(b);
    setShiplets({ ...shipletsAtStart[b] });
    setRules(Object.fromEntries(sc.rules.map((r) => [r.id, r.status])));
    setRequests(requestsFor(sc.tier === "ShipTime One", sc.sites[1]?.name ?? sc.sites[0].name));
    setView("home");
    window.scrollTo(0, 0);
  };
  const setShiplet = (id: string, s: ShipletStatus) => setShiplets((m) => ({ ...m, [id]: s }));
  const send = (about: About, title: string) => {
    const one = scenarios[brand!].tier === "ShipTime One";
    setRequests((r) => [{ id: `R-${1049 + r.length}`, title, about, state: "Submitted", owner: one ? "Priya Shah" : "ShipTime support", promise: one ? "First reply by 11:30 am" : "Reply within 1 business day", created: "Just now" }, ...r]);
    setAsking(null);
  };

  if (!brand) return <Login onSignIn={signIn} />;
  const sc = scenarios[brand];
  const one = sc.tier === "ShipTime One";

  return (
    <ScenarioContext.Provider value={sc}>
      <AskContext.Provider value={setAsking}>
        <Shell key={brand} view={view} go={go} sandbox={sandbox} setSandbox={setSandbox} onSignOut={() => setBrand(null)} extra={one ? <TeamMini onMessage={() => setAsking({ kind: "General", label: "Message to your team" })} /> : undefined}>
          {view === "home" && <Home go={go} shiplets={shiplets} setShiplet={setShiplet} />}
          {view === "shipments" && <Shipments returnsLive={shiplets.returns === "Live"} open={(id) => { setShipmentId(id); go("shipment"); }} />}
          {view === "shipment" && <ShipmentDetail id={shipmentId} back={() => go("shipments")} go={go} trackingLive={shiplets.tracking === "Live"} onTrackingOn={() => setShiplet("tracking", "Live")} />}
          {view === "billing" && <Billing open={() => go("invoice")} />}
          {view === "invoice" && <InvoiceDetail back={() => go("billing")} />}
          {view === "shiplets" && <ShipletsPage shiplets={shiplets} setShiplet={setShiplet} open={(id) => { setShipletId(id); go("shiplet"); }} />}
          {view === "shiplet" && <ShipletDetail key={shipletId} id={shipletId} shiplets={shiplets} setShiplet={setShiplet} back={() => go("shiplets")} go={go} />}
          {view === "requests" && <RequestsPage requests={requests} go={go} />}
          {one && view === "network" && <SitesPage go={go} />}
          {one && view === "rules" && <RulesPage statuses={rules} open={(id) => { setRuleId(id); go("rule"); }} />}
          {one && view === "rule" && <RuleDetail key={ruleId} id={ruleId} status={rules[ruleId]} setStatus={(s) => setRules((m) => ({ ...m, [ruleId]: s }))} back={() => go("rules")} />}
          {one && view === "golive" && <ProjectPage />}
          {one && view === "report" && <Report />}
          {view === "developers" && <Developers />}
        </Shell>
        {asking && <AskDrawer about={asking} onClose={() => setAsking(null)} onSend={(t) => send(asking, t)} />}
      </AskContext.Provider>
    </ScenarioContext.Provider>
  );
}
