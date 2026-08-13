// Tracking stack, matched to what shiptime.com runs so the landing pages report
// into the same properties (IDs read from the live shiptime.com source).
//
// ⚠️ These are deliberately PLAIN <script> tags, not next/script.
// next/script with strategy="afterInteractive" does not emit a real tag into the
// server HTML — it serialises into React's RSC payload and only becomes a script
// after hydration. That made the tags invisible to `view-source`, to third-party
// installation checkers, and (per a live Realtime test on 2026-08-03) meant GA4
// wasn't registering hits at all. Plain tags execute as the document parses, so
// they're guaranteed to fire and are verifiable by anyone inspecting the page.
// Don't "modernise" these back to next/script without re-testing in GA Realtime.
//
// GTM (GTM-WHNCFPN3) was removed 2026-08-03: we couldn't confirm whether that
// container also fired GA4 / Meta Pixel / Clarity, and running both it and these
// would double-count. The agency runs its own container — if one is ever wanted
// here, add their ID and delete the matching script below rather than both.
//
// Deliberately NOT included: Universal Analytics (UA-49380729-1) is still on
// shiptime.com but stopped processing data in 2023, so it would collect nothing.
const GA4_ID = "G-XVFEYDGD5H";        // main shiptime.com property (316813460)
const META_PIXEL_ID = "459473094815977";
const CLARITY_ID = "k1s7pph1hu";
const HUBSPOT_PORTAL_ID = "342617162"; // na3 region
const RB2B_SRC =
  "https://cdn.rlets.com/capture_configs/d9b/289/64b/6c8419f97e667fb5aea755e.js";

// Sessions must stitch across the marketing site and this lp subdomain,
// otherwise one visitor is counted twice and the conversion loses its source.
const LINKER_DOMAINS = ["shiptime.com", "lp.shiptime.com", "shiptimelandin.com"];

const GA4_INIT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA4_ID}', { linker: { domains: ${JSON.stringify(LINKER_DOMAINS)} } });
`;

const META_PIXEL_INIT = `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
`;

// ── Campaign attribution persistence ─────────────────────────────────────────
// Stores the UTM triple in localStorage the moment a visitor lands, so a signup
// that happens later — after they've left the campaign URL and come back
// without the parameters — still carries the campaign that produced it.
// ShipTime's own signup pages do exactly this (David, 2026-08-12): "a lot of
// times they'll come to the page from a Google ad, exit it, and later go to
// shiptime.com without the UTMs, which then we lose the tracking."
//
// Two writes, on purpose:
//  • st_utm_source / st_utm_medium / st_utm_campaign — the exact three keys
//    ShipTime's main.js writes and reads (verified from the screen share). Same
//    names and same shape, so our pages and theirs agree on where attribution
//    lives and either can pick it up.
//  • st_attribution — our own JSON blob, which additionally carries utm_term,
//    utm_content and gclid. ShipTime's three keys don't cover those and the CRM
//    lead wants them, so the blob stays rather than losing the extra fields.
//
// Deliberately a plain inline script rather than a React effect: it runs while
// the document parses, on every page, whether or not that page happens to mount
// a form component. The matching reader/writer in TypeScript lives in
// components/ui/lead-capture-form.tsx (captureAttribution / readAttribution /
// clearAttribution) and uses this same key and shape — change both together.
//
// localStorage is per-origin, so this covers repeat visits to *our* pages. It
// cannot hand the value to shiptime.com — a different origin reads a different
// store — so a visitor who lands here and later signs up on shiptime.com is
// only attributed if shiptime.com's own script stored the UTMs on that visit.
// Signups completed here go through /api/signup, which passes the stored triple
// to the ShipTime API directly, so those keep their attribution regardless.
const ATTRIBUTION_KEY = "st_attribution";

const ATTRIBUTION_INIT = `
(function(){
  try {
    var keys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid'];
    var params = new URLSearchParams(window.location.search);
    var fresh = {};
    for (var i = 0; i < keys.length; i++) {
      var v = params.get(keys[i]);
      if (v) fresh[keys[i]] = v;
    }
    // A URL carrying UTMs is a new campaign touch and replaces whatever was
    // stored — otherwise a click on this month's ad would still be credited to
    // an ad they clicked months ago. With no UTMs in the URL (internal
    // navigation, or a direct return visit) the stored value is left alone.
    if (Object.keys(fresh).length) {
      // ShipTime's three keys, written the way their client writes them (only
      // when the value is non-empty).
      if (fresh.utm_source)   localStorage.setItem('st_utm_source', fresh.utm_source);
      if (fresh.utm_medium)   localStorage.setItem('st_utm_medium', fresh.utm_medium);
      if (fresh.utm_campaign) localStorage.setItem('st_utm_campaign', fresh.utm_campaign);
      fresh.ts = new Date().toISOString();
      localStorage.setItem('${ATTRIBUTION_KEY}', JSON.stringify(fresh));
    }
  } catch (e) { /* private mode / storage disabled — forms fall back to the live URL */ }
})();
`;

const CLARITY_INIT = `
(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_ID}");
`;

export function Tracking() {
  return (
    <>
      {/* ── Campaign attribution (first, so it's stored before anything else
           can navigate away) ── */}
      <script dangerouslySetInnerHTML={{ __html: ATTRIBUTION_INIT }} />

      {/* ── Google Analytics 4 ── */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} />
      <script dangerouslySetInnerHTML={{ __html: GA4_INIT }} />

      {/* ── Meta (Facebook) Pixel ── */}
      <script dangerouslySetInnerHTML={{ __html: META_PIXEL_INIT }} />

      {/* ── Microsoft Clarity (session recording / heatmaps) ── */}
      <script dangerouslySetInnerHTML={{ __html: CLARITY_INIT }} />

      {/* ── HubSpot tracking (ties page views to the contacts we create) ── */}
      <script async defer id="hs-script-loader" src={`https://js-na3.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js`} />

      {/* ── RB2B / Reach visitor identification ── */}
      <script async src={RB2B_SRC} />
    </>
  );
}

// JS-disabled fallback. Must live in <body>.
export function TrackingNoScript() {
  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        alt=""
        src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
}
