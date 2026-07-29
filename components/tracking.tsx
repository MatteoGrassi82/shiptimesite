import Script from "next/script";

// Tracking stack, matched to what shiptime.com runs so the landing pages report
// into the same properties (IDs read from the live shiptime.com source).
//
// ⚠️ DOUBLE-COUNTING: the GTM container below may already fire GA4, the Meta
// Pixel and/or Clarity as tags. If it does, remove EITHER the GTM tag or the
// matching hard-coded script here — running both double-counts pageviews and
// conversions. Check the container before trusting the numbers.
//
// Deliberately NOT included: Universal Analytics (UA-49380729-1) is still on
// shiptime.com but stopped processing data in 2023, so it would collect nothing.
const GTM_ID = "GTM-WHNCFPN3";
const GA4_ID = "G-XVFEYDGD5H";        // main shiptime.com property
const META_PIXEL_ID = "459473094815977";
const CLARITY_ID = "k1s7pph1hu";
const HUBSPOT_PORTAL_ID = "342617162"; // na3 region

// Sessions must stitch across the marketing site and this lp subdomain,
// otherwise one visitor is counted twice and the conversion loses its source.
const LINKER_DOMAINS = ["shiptime.com", "lp.shiptime.com", "shiptimelandin.com"];

export function Tracking() {
  return (
    <>
      {/* ── Google Tag Manager ── */}
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>

      {/* ── Google Analytics 4 ── */}
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_ID}', {
            linker: { domains: ${JSON.stringify(LINKER_DOMAINS)} }
          });
        `}
      </Script>

      {/* ── Meta (Facebook) Pixel ── */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>

      {/* ── Microsoft Clarity (session recording / heatmaps) ── */}
      <Script id="clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_ID}");`}
      </Script>

      {/* ── HubSpot tracking (ties page views to the contacts we create) ── */}
      <Script
        id="hs-script-loader"
        src={`https://js-na3.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js`}
        strategy="afterInteractive"
        async
        defer
      />

      {/* ── RB2B visitor identification (already in use on these pages) ── */}
      <Script
        src="https://cdn.rlets.com/capture_configs/d9b/289/64b/6c8419f97e667fb5aea755e.js"
        strategy="afterInteractive"
      />
    </>
  );
}

// JS-disabled fallbacks. These must live in <body>, not via next/script.
export function TrackingNoScript() {
  return (
    <>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
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
    </>
  );
}
