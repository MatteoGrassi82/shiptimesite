import { Composition } from "remotion";
import { RateShoppingDemo } from "./RateShoppingDemo";
import { ShippingFlowComp } from "./ShippingFlowComp";
import { RateAuditComp } from "./RateAuditComp";
import { TrackingContextComp } from "./TrackingContextComp";

// All ShipTime video compositions are registered here. Add more <Composition>
// entries as you create new demos.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 4:5 portrait (1080x1350) — fills the tall feature-showcase panel */}
      <Composition
        id="RateShoppingDemo"
        component={RateShoppingDemo}
        durationInFrames={210} // 7s @ 30fps
        fps={30}
        width={1080}
        height={1350}
      />
      <Composition
        id="ShippingFlowComp"
        component={ShippingFlowComp}
        durationInFrames={300} // 10s @ 30fps, seamless loop
        fps={30}
        width={1080}
        height={1350}
      />
      <Composition
        id="RateAuditComp"
        component={RateAuditComp}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1350}
      />
      <Composition
        id="TrackingContextComp"
        component={TrackingContextComp}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1350}
      />
    </>
  );
};
