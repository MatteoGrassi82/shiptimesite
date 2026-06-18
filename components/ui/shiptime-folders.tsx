"use client"

import { useEffect, useRef, useState } from "react"

const REPORT_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeLZv90COHXyXqlijLX6Gls5SMAquTHc8POd8JO3ajmxSdiVA/viewform?usp=send_form&utm_source=shiptimelandin&utm_medium=landing&utm_campaign=logistics-report&utm_content=folders"

const mn = "var(--font-manrope), system-ui, sans-serif"
const it = "var(--font-inter), system-ui, sans-serif"
const navy = "#1C1E3D"
const orange = "#EC5A26"
const muted = "#6E728A"
const border = "#E8E8E8"
const surface = "#F4F5F7"
const white = "#FFFFFF"

const TABS = [
  {
    tab: "Manual Shipping",
    heading: ["From parcel to delivered,", "in one flow"],
    sub: "No more juggling carrier sites and a rate spreadsheet.",
    features: [
      { title: "Every carrier, one screen", body: "Compare courier, LTL, and Canada Post side by side, then print the cheapest qualified label in seconds." },
      { title: "Bring your own rates", body: "Plug in the pricing you have already negotiated and shop it against ours on every shipment." },
    ],
  },
  {
    tab: "Multiple Carriers",
    heading: ["One login.", "All your carriers."],
    sub: "Real rates with every surcharge included — before you commit.",
    features: [
      { title: "Every major carrier", body: "Canada Post, Purolator, UPS, FedEx, DHL and more — all in one dashboard, one login." },
      { title: "True rate comparison", body: "See the real cost including fuel surcharges, residential fees, and delivery area charges before you book." },
    ],
  },
  {
    tab: "Freight & LTL",
    heading: ["Book freight like", "you book parcels."],
    sub: "One invoice. Total cost visibility up front. No surprise surcharges.",
    features: [
      { title: "No more phone calls", body: "Get LTL quotes instantly, the same way you compare parcel rates. No PDFs, no back-and-forth." },
      { title: "No surprise surcharges", body: "Total cost visibility before you book. One invoice at month end. No reconciling." },
    ],
  },
  {
    tab: "eCommerce",
    heading: ["Orders in.", "Labels out."],
    sub: "Direct integration with your store. Zero manual steps.",
    features: [
      { title: "Shopify, WooCommerce & more", body: "Orders flow in automatically. Labels print. Tracking numbers sync back without you touching anything." },
      { title: "Rules-based automation", body: "Set carrier rules by weight, destination, or service level. ShipTime picks the right option every time." },
    ],
  },
  {
    tab: "Spreadsheets",
    heading: ["Every shipment.", "One dashboard."],
    sub: "Pull real reports. Show finance exactly where the money goes.",
    features: [
      { title: "Unified shipping data", body: "Every carrier, cost, and tracking event in one place. No more reconciling across four spreadsheets." },
      { title: "Finance-ready reports", body: "Export carrier spend by date, cost centre, or shipment type. Stop the monthly fire drill." },
    ],
  },
]

const N = TABS.length
const SCROLL_PER_CARD = 500

// ── Right-side videos (pre-rendered Remotion compositions) ───────────────────

const VIDEO_SRCS = [
  "/generated/ShippingFlowComp.mp4",    // Manual Shipping
  "/generated/RateShoppingDemo.mp4",    // Multiple Carriers
  "/generated/RateAuditComp.mp4",       // Freight & LTL
  "/generated/ShippingFlowComp.mp4",    // eCommerce (reuse)
  "/generated/TrackingContextComp.mp4", // Spreadsheets
]


// ── Main component ────────────────────────────────────────────────────────────

export default function ShipTimeFolders() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  // Fractional scroll progress through the section (0 → N-1), drives the
  // sliding tab indicator so it glides between tabs instead of snapping.
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current
        if (!el) return
        const scrolled = -el.getBoundingClientRect().top
        const frac = Math.min(Math.max(scrolled / SCROLL_PER_CARD, 0), N - 1)
        setProgress(frac)
        setActiveIndex(Math.round(frac))
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Jump scroll position to a given tab (click support).
  const goToTab = (i: number) => {
    const el = sectionRef.current
    if (!el) return
    const top = el.offsetTop + i * SCROLL_PER_CARD + 4
    window.scrollTo({ top, behavior: "smooth" })
  }

  return (
    <div ref={sectionRef} style={{ height: `calc(${N} * ${SCROLL_PER_CARD}px + 100vh)`, background: surface }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center px-5 md:px-8" style={{ overflow: "hidden", paddingTop: 24, paddingBottom: 24 }}>
        <div style={{ maxWidth: 1360, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", height: "calc(100vh - 48px)" }}>

          {/* ── Tab strip — full width, outside the card, with sliding indicator ── */}
          <div style={{ position: "relative", borderBottom: `1px solid ${border}`, marginBottom: 16, flexShrink: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${N}, 1fr)` }}>
              {TABS.map((item, i) => (
                <button
                  key={item.tab}
                  onClick={() => goToTab(i)}
                  style={{
                    padding: "14px 0",
                    border: "none",
                    borderRight: i < N - 1 ? `1px solid ${border}` : "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: i === activeIndex ? navy : muted,
                    fontFamily: mn,
                    fontWeight: i === activeIndex ? 700 : 500,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    transition: "color 0.3s ease",
                    outline: "none",
                  }}
                >
                  {item.tab}
                </button>
              ))}
            </div>
            {/* Sliding orange indicator — glides with scroll progress */}
            <div
              style={{
                position: "absolute",
                bottom: -1,
                left: `${(progress / N) * 100}%`,
                width: `${100 / N}%`,
                height: 2,
                background: orange,
                borderRadius: 2,
              }}
            />
          </div>

          {/* ── Card — fills remaining viewport height ── */}
          <div style={{
            background: white,
            borderRadius: 28,
            border: `1px solid ${border}`,
            boxShadow: "0 2px 32px rgba(28,30,61,0.08), 0 1px 4px rgba(28,30,61,0.04)",
            padding: "52px 56px",
            display: "flex",
            gap: 56,
            alignItems: "stretch",
            overflow: "hidden",
            flex: 1,
            minHeight: 0,
          }}>

            {/* Left — animated text content, staggered reveal per tab change */}
            <div style={{ flex: "0 0 38%", position: "relative", display: "flex", alignItems: "center" }}>
              {TABS.map((item, i) => {
                const on = i === activeIndex
                // Stagger child elements: each appears slightly after the last
                const child = (delay: number): React.CSSProperties => ({
                  opacity: on ? 1 : 0,
                  transform: on ? "translateY(0)" : "translateY(14px)",
                  transition: `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${on ? delay : 0}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${on ? delay : 0}ms`,
                })
                return (
                  <div
                    key={item.tab}
                    style={{
                      position: "absolute",
                      top: "50%", left: 0, width: "100%",
                      transform: "translateY(-50%)",
                      pointerEvents: on ? "auto" : "none",
                    }}
                  >
                    <h2 style={{ ...child(0), fontFamily: mn, fontWeight: 800, fontSize: "clamp(1.7rem, 2.4vw, 2.4rem)", color: navy, lineHeight: 1.12, letterSpacing: "-0.025em", marginBottom: 12 }}>
                      {item.heading[0]}<br />{item.heading[1]}
                    </h2>
                    <p style={{ ...child(60), fontFamily: it, fontSize: 15, color: muted, lineHeight: 1.65, marginBottom: 28 }}>
                      {item.sub}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 32 }}>
                      {item.features.map((f, fi) => (
                        <div key={f.title} style={{ ...child(120 + fi * 70), paddingLeft: 16, borderLeft: `3px solid ${orange}` }}>
                          <p style={{ fontFamily: mn, fontWeight: 700, fontSize: 14, color: navy, marginBottom: 4 }}>{f.title}</p>
                          <p style={{ fontFamily: it, fontSize: 13.5, color: muted, lineHeight: 1.65 }}>{f.body}</p>
                        </div>
                      ))}
                    </div>
                    <a
                      href={REPORT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ ...child(280), display: "inline-flex", alignItems: "center", gap: 6, background: navy, color: white, fontFamily: mn, fontWeight: 600, fontSize: 14, padding: "11px 24px", borderRadius: 999, textDecoration: "none" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.85" }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1" }}
                    >
                      Start Shipping →
                    </a>
                  </div>
                )
              })}
            </div>

            {/* Right — Remotion video per tab, fills full card height */}
            <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
              {VIDEO_SRCS.map((src, i) => {
                const on = i === activeIndex
                return (
                  <div
                    key={src + i}
                    style={{
                      position: "absolute",
                      top: 0, left: 0, right: 0, bottom: 0,
                      opacity: on ? 1 : 0,
                      transform: on ? "translateY(0) scale(1)" : "translateY(14px) scale(0.985)",
                      transition: "opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                      pointerEvents: on ? "auto" : "none",
                      borderRadius: 16,
                      overflow: "hidden",
                      border: `1px solid ${border}`,
                      background: surface,
                      boxShadow: on ? "0 20px 50px -30px rgba(28,30,61,0.35)" : "none",
                    }}
                  >
                    <video
                      src={src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", position: "absolute", inset: 0 }}
                    />
                  </div>
                )
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
