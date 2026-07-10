import { Composition } from "remotion";
import { RateShoppingDemo } from "./RateShoppingDemo";
import { ShippingFlowComp } from "./ShippingFlowComp";
import { RateAuditComp } from "./RateAuditComp";
import { TrackingContextComp } from "./TrackingContextComp";
import { ShipAuditFilm } from "./plus/ShipAuditFilm";
import { RateEngineFilm } from "./plus/RateEngineFilm";
import { CrossBorderFilm } from "./plus/CrossBorderFilm";
import { SmartRoutingFilm } from "./plus/SmartRoutingFilm";

// All ShipTime video compositions are registered here. Add more <Composition>
// entries as you create new demos.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Base ShipTime (navy/orange) — 4:5 portrait 1080x1350 ───────────── */}
      <Composition id="RateShoppingDemo" component={RateShoppingDemo} durationInFrames={210} fps={30} width={1080} height={1350} />
      <Composition id="ShippingFlowComp" component={ShippingFlowComp} durationInFrames={300} fps={30} width={1080} height={1350} />
      <Composition id="RateAuditComp" component={RateAuditComp} durationInFrames={300} fps={30} width={1080} height={1350} />
      <Composition id="TrackingContextComp" component={TrackingContextComp} durationInFrames={300} fps={30} width={1080} height={1350} />

      {/* ── ShipTime Plus films (teal on near-black) — 4:5 portrait ─────────── */}
      <Composition id="ShipAuditFilm" component={ShipAuditFilm} durationInFrames={240} fps={30} width={1080} height={1350} />
      <Composition id="RateEngineFilm" component={RateEngineFilm} durationInFrames={210} fps={30} width={1080} height={1350} />
      <Composition id="CrossBorderFilm" component={CrossBorderFilm} durationInFrames={270} fps={30} width={1080} height={1350} />
      <Composition id="SmartRoutingFilm" component={SmartRoutingFilm} durationInFrames={270} fps={30} width={1080} height={1350} />
    </>
  );
};
