import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ShipTime for Shopify — Cut Your Shipping Bill Up to 70%",
  description:
    "Install the ShipTime app, sync your Shopify orders in one click, and compare live rates from 500+ couriers. Free to install, no monthly fee.",
  alternates: { canonical: "/shopify" },
  openGraph: {
    title: "ShipTime for Shopify — Cut Your Shipping Bill Up to 70%",
    description:
      "Compare 500+ carriers, print labels, and sync tracking back to Shopify automatically. Free to install.",
    type: "website",
  },
};

const SAVINGS_PCT = 70;
const CARRIER_COUNT = 500;
const COUNTRIES_COUNT = 220;

const SHOPIFY_APP_URL =
  "https://apps.shopify.com/shiptime";

const ds = {
  navy: "#1C1E3D",
  muted: "#6E728A",
  orange: "#EC5A26",
  orangeLight: "#F89A6D",
  border: "#E8E8E8",
  surface: "#F8FAFB",
  white: "#FFFFFF",
};

function ShopifyLogo({ size = 22 }: { size?: number }) {
  return (
    <Image
      src="/shopify/logo-shopify.svg"
      alt=""
      width={size}
      height={size}
      style={{ borderRadius: "50%" }}
    />
  );
}

export default function ShopifyPage() {
  return (
    <div
      style={{
        background: ds.white,
        color: ds.navy,
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ─── NAV ─── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: `1px solid ${ds.border}`,
        }}
      >
        <nav
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "14px 32px",
            display: "flex",
            alignItems: "center",
            gap: 26,
          }}
        >
          <Image
            src="/shiptime-logo.svg"
            alt="ShipTime"
            width={120}
            height={28}
            style={{ height: 28, width: "auto" }}
          />
          <div style={{ display: "flex", gap: 2, marginLeft: 6 }}>
            {(
              [
                ["#why", "Why switch"],
                ["#how", "How it works"],
                ["#tools", "Tools"],
                ["#", "Pricing"],
              ] as [string, string][]
            ).map(([href, label]) => (
              <a
                key={label}
                href={href}
                style={{
                  font: "600 14px/1 var(--font-inter)",
                  color: ds.navy,
                  textDecoration: "none",
                  padding: "9px 13px",
                  borderRadius: 8,
                }}
              >
                {label}
              </a>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <span
            style={{
              font: "600 13px/1 var(--font-inter)",
              color: ds.muted,
              padding: "9px 10px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            EN / FR
          </span>
          <a
            href="https://app.shiptime.com/login"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              font: "600 14px/1 var(--font-inter)",
              padding: "10px 16px",
              border: `1px solid ${ds.border}`,
              borderRadius: 12,
              background: ds.white,
              color: ds.navy,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Log in
          </a>
          <a
            href={SHOPIFY_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              font: "600 14px/1 var(--font-inter)",
              padding: "11px 18px",
              background: ds.orange,
              color: ds.white,
              border: 0,
              borderRadius: 12,
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(28,30,61,0.06)",
              textDecoration: "none",
            }}
          >
            <ShopifyLogo size={18} />
            Install on Shopify
          </a>
        </nav>
      </header>

      {/* ─── HERO ─── */}
      <section
        style={{
          background:
            "radial-gradient(ellipse 140% 110% at 0% 0%, #DCE8F8 0%, #E8F0FB 20%, rgba(232,240,251,0) 55%), radial-gradient(ellipse 120% 100% at 100% 100%, #F8E5D8 0%, #FCF0E9 25%, rgba(252,240,233,0) 60%), #FFFFFF",
          borderBottom: `1px solid ${ds.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "84px 32px 92px",
            display: "grid",
            gridTemplateColumns: "minmax(0,1.04fr) minmax(0,0.96fr)",
            gap: 64,
            alignItems: "center",
          }}
          className="shopify-hero-grid"
        >
          {/* Left */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                background: ds.white,
                border: `1px solid ${ds.border}`,
                borderRadius: 999,
                padding: "7px 14px 7px 8px",
                boxShadow: "0 1px 2px rgba(28,30,61,0.06)",
              }}
            >
              <ShopifyLogo size={22} />
              <span
                style={{
                  font: "700 12px/1 var(--font-inter)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: ds.navy,
                }}
              >
                Built for Shopify merchants
              </span>
            </div>

            <h1
              style={{
                margin: "22px 0 0",
                font: "800 clamp(2rem,4.5vw,60px)/1.04 var(--font-manrope)",
                letterSpacing: "-0.025em",
                color: ds.navy,
              }}
            >
              Switch to ShipTime and cut your Shopify shipping bill{" "}
              <em style={{ fontStyle: "normal", color: ds.orange }}>
                up to {SAVINGS_PCT}%.
              </em>
            </h1>

            <p
              style={{
                margin: "24px 0 0",
                font: "500 20px/1.55 var(--font-inter)",
                color: ds.muted,
                maxWidth: "54ch",
              }}
            >
              Install the app, sync your Shopify orders in one click, and
              compare live rates from {CARRIER_COUNT}+ couriers. Labels print
              and tracking syncs back automatically — with no monthly fee and no
              per-label fee.
            </p>

            <div
              style={{
                display: "flex",
                gap: 14,
                marginTop: 34,
                flexWrap: "wrap",
              }}
            >
              <a
                href={SHOPIFY_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 11,
                  font: "600 18px/1 var(--font-inter)",
                  padding: "18px 30px",
                  background: ds.orange,
                  color: ds.white,
                  border: 0,
                  borderRadius: 12,
                  cursor: "pointer",
                  boxShadow: "0 12px 28px rgba(236,90,38,0.28)",
                  textDecoration: "none",
                }}
              >
                <ShopifyLogo size={22} />
                Install on Shopify — Free
              </a>
              <a
                href="https://www.shiptime.com/get-a-quote"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  font: "600 18px/1 var(--font-inter)",
                  padding: "18px 28px",
                  background: ds.white,
                  color: ds.navy,
                  border: `1px solid ${ds.border}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                See live rates
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  style={{ width: 18, height: 18 }}
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 22,
                font: "500 14px/1.4 var(--font-inter)",
                color: ds.muted,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16A34A"
                strokeWidth="2.4"
                style={{ width: 18, height: 18, flex: "none" }}
              >
                <path
                  d="M20 6L9 17l-5-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Free to install · Heroic bilingual support · Cancel anytime
            </div>

            <div style={{ marginTop: 40 }}>
              <div
                style={{
                  font: "700 11px/1 var(--font-inter)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#9296A8",
                  marginBottom: 16,
                }}
              >
                Real rates from the carriers you already trust
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  flexWrap: "wrap",
                  opacity: 0.9,
                }}
              >
                {[
                  { src: "/shopify/carrier-canadapost.svg", alt: "Canada Post", h: 22 },
                  { src: "/shopify/carrier-purolator.svg", alt: "Purolator", h: 22 },
                  { src: "/shopify/carrier-fedex.svg", alt: "FedEx", h: 22 },
                  { src: "/shopify/carrier-ups.svg", alt: "UPS", h: 24 },
                  { src: "/shopify/carrier-dhl.svg", alt: "DHL", h: 14 },
                  { src: "/shopify/carrier-usps.svg", alt: "USPS", h: 20 },
                ].map(({ src, alt, h }) => (
                  <Image
                    key={alt}
                    src={src}
                    alt={alt}
                    width={80}
                    height={h}
                    style={{ height: h, width: "auto" }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: rate panel */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                background: ds.white,
                border: `1px solid ${ds.border}`,
                borderRadius: 24,
                boxShadow:
                  "0 20px 48px rgba(28,30,61,0.12),0 4px 12px rgba(28,30,61,0.06)",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: "16px 22px",
                  background: ds.surface,
                  borderBottom: `1px solid ${ds.border}`,
                }}
              >
                <ShopifyLogo size={24} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <span
                    style={{
                      font: "700 13px/1 var(--font-inter)",
                      color: ds.navy,
                    }}
                  >
                    Synced from Shopify · Order #1024
                  </span>
                  <span
                    style={{
                      font: "500 12px/1 var(--font-inter)",
                      color: ds.muted,
                    }}
                  >
                    2.1 kg parcel · Toronto, ON → Vancouver, BC
                  </span>
                </div>
                <span
                  style={{
                    marginLeft: "auto",
                    font: "700 10px/1 var(--font-inter)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#16754A",
                    background: "#E9F7EF",
                    padding: "6px 10px",
                    borderRadius: 999,
                  }}
                >
                  Auto-filled
                </span>
              </div>

              {/* Best value row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.3fr 0.8fr auto",
                  gap: 14,
                  alignItems: "center",
                  padding: "18px 22px",
                  background: "#FFF3EE",
                  borderBottom: "1px solid #F2E0D6",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <Image
                    src="/shopify/carrier-canadapost.svg"
                    alt=""
                    width={80}
                    height={22}
                    style={{ height: 22, width: "auto" }}
                  />
                  <div>
                    <div
                      style={{
                        font: "600 15px/1.2 var(--font-inter)",
                        color: ds.navy,
                      }}
                    >
                      Expedited Parcel
                    </div>
                    <div
                      style={{
                        font: "500 12px/1 var(--font-inter)",
                        color: ds.muted,
                        marginTop: 3,
                      }}
                    >
                      2 days · pickup included
                    </div>
                  </div>
                </div>
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      font: "700 10px/1 var(--font-inter)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#A33712",
                      background: "#FEE2D4",
                      padding: "5px 9px",
                      borderRadius: 999,
                    }}
                  >
                    Best value
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      font: "700 22px/1 var(--font-inter)",
                      color: "#A33712",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    $14.28
                  </div>
                </div>
              </div>

              {/* Purolator row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.3fr 0.8fr auto",
                  gap: 14,
                  alignItems: "center",
                  padding: "18px 22px",
                  borderBottom: `1px solid ${ds.border}`,
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <Image
                    src="/shopify/carrier-purolator.svg"
                    alt=""
                    width={80}
                    height={20}
                    style={{ height: 20, width: "auto" }}
                  />
                  <div>
                    <div
                      style={{
                        font: "600 15px/1.2 var(--font-inter)",
                        color: ds.navy,
                      }}
                    >
                      Ground
                    </div>
                    <div
                      style={{
                        font: "500 12px/1 var(--font-inter)",
                        color: ds.muted,
                        marginTop: 3,
                      }}
                    >
                      2 days · signature optional
                    </div>
                  </div>
                </div>
                <div />
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      font: "700 22px/1 var(--font-inter)",
                      color: ds.navy,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    $15.90
                  </div>
                </div>
              </div>

              {/* FedEx row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.3fr 0.8fr auto",
                  gap: 14,
                  alignItems: "center",
                  padding: "18px 22px",
                  borderBottom: `1px solid ${ds.border}`,
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <Image
                    src="/shopify/carrier-fedex.svg"
                    alt=""
                    width={60}
                    height={22}
                    style={{ height: 22, width: "auto" }}
                  />
                  <div>
                    <div
                      style={{
                        font: "600 15px/1.2 var(--font-inter)",
                        color: ds.navy,
                      }}
                    >
                      Express Saver
                    </div>
                    <div
                      style={{
                        font: "500 12px/1 var(--font-inter)",
                        color: ds.muted,
                        marginTop: 3,
                      }}
                    >
                      next day by end of day
                    </div>
                  </div>
                </div>
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      font: "700 10px/1 var(--font-inter)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: ds.navy,
                      background: "#EEF0F5",
                      padding: "5px 9px",
                      borderRadius: 999,
                    }}
                  >
                    Fastest
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      font: "700 22px/1 var(--font-inter)",
                      color: ds.navy,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    $24.10
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "18px 22px",
                  background: "#FCFCFC",
                }}
              >
                <span
                  style={{
                    font: "600 14px/1.3 var(--font-inter)",
                    color: ds.navy,
                  }}
                >
                  You saved{" "}
                  <strong style={{ color: ds.orange }}>$9.82</strong> vs
                  Shopify Shipping
                </span>
                <a
                  href={SHOPIFY_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    font: "600 13px/1 var(--font-inter)",
                    padding: "11px 18px",
                    background: ds.orange,
                    color: ds.white,
                    border: 0,
                    borderRadius: 10,
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                >
                  Print label
                </a>
              </div>
            </div>

            {/* Floating tracking chip */}
            <div
              style={{
                position: "absolute",
                right: -14,
                bottom: -22,
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: ds.navy,
                color: ds.white,
                padding: "12px 16px",
                borderRadius: 14,
                boxShadow: "0 12px 28px rgba(28,30,61,0.28)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F89A6D"
                strokeWidth="2"
                style={{ width: 18, height: 18 }}
              >
                <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
                <path
                  d="M22 4l-10 10-3-3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                style={{ font: "600 13px/1.3 var(--font-inter)" }}
              >
                Tracking pushed back to Shopify
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY SWITCH ─── */}
      <section
        id="why"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 32px" }}
      >
        <div
          style={{
            font: "700 13px/1.2 var(--font-inter)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: ds.orange,
          }}
        >
          Why merchants switch
        </div>
        <h2
          style={{
            margin: "14px 0 0",
            font: "800 clamp(1.8rem,4vw,46px)/1.12 var(--font-manrope)",
            letterSpacing: "-0.02em",
            color: ds.navy,
            maxWidth: "18ch",
          }}
        >
          Shopify gets your store. ShipTime gets your shipping.
        </h2>
        <p
          style={{
            margin: "18px 0 0",
            font: "500 19px/1.55 var(--font-inter)",
            color: ds.muted,
            maxWidth: "60ch",
          }}
        >
          Keep selling on Shopify exactly as you do today. Hand the hard part —
          finding the cheapest reliable label for every order — to ShipTime.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 18,
            marginTop: 44,
          }}
          className="why-grid"
        >
          {/* Big card 1 */}
          <div
            style={{
              gridColumn: "span 3",
              background: ds.white,
              border: `1px solid ${ds.border}`,
              borderRadius: 16,
              padding: 30,
              boxShadow: "0 1px 2px rgba(28,30,61,0.06)",
            }}
            className="why-card-big"
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                background: "#FFF3EE",
                display: "grid",
                placeItems: "center",
                marginBottom: 18,
              }}
            >
              <Image
                src="/shopify/icon-audit.svg"
                alt=""
                width={30}
                height={30}
              />
            </div>
            <h3
              style={{
                margin: "0 0 8px",
                font: "700 22px/1.25 var(--font-manrope)",
                color: ds.navy,
                letterSpacing: "-0.01em",
              }}
            >
              Save up to {SAVINGS_PCT}% on every label
            </h3>
            <p
              style={{
                margin: 0,
                font: "400 15px/1.55 var(--font-inter)",
                color: ds.muted,
              }}
            >
              ShipTime negotiates volume discounts and passes them straight to
              you — typically far below the rates baked into Shopify Shipping.
              The cheapest reliable option is pre-selected on every order.
            </p>
          </div>

          {/* Big card 2 */}
          <div
            style={{
              gridColumn: "span 3",
              background: ds.white,
              border: `1px solid ${ds.border}`,
              borderRadius: 16,
              padding: 30,
              boxShadow: "0 1px 2px rgba(28,30,61,0.06)",
            }}
            className="why-card-big"
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                background: "#FFF3EE",
                display: "grid",
                placeItems: "center",
                marginBottom: 18,
              }}
            >
              <Image
                src="/shopify/icon-courier.svg"
                alt=""
                width={30}
                height={30}
              />
            </div>
            <h3
              style={{
                margin: "0 0 8px",
                font: "700 22px/1.25 var(--font-manrope)",
                color: ds.navy,
                letterSpacing: "-0.01em",
              }}
            >
              {CARRIER_COUNT}+ courier & LTL services
            </h3>
            <p
              style={{
                margin: 0,
                font: "400 15px/1.55 var(--font-inter)",
                color: ds.muted,
              }}
            >
              Compare Canada Post, Purolator, FedEx, UPS, DHL, USPS and more
              side-by-side — plus pallet freight — instead of the handful
              Shopify Shipping offers. One account, every carrier.
            </p>
          </div>

          {/* Small card 3 */}
          <div
            style={{
              gridColumn: "span 2",
              background: ds.white,
              border: `1px solid ${ds.border}`,
              borderRadius: 16,
              padding: 28,
              boxShadow: "0 1px 2px rgba(28,30,61,0.06)",
            }}
            className="why-card-small"
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#FFF3EE",
                display: "grid",
                placeItems: "center",
                marginBottom: 16,
              }}
            >
              <Image
                src="/shopify/icon-package.svg"
                alt=""
                width={28}
                height={28}
              />
            </div>
            <h3
              style={{
                margin: "0 0 8px",
                font: "700 18px/1.3 var(--font-manrope)",
                color: ds.navy,
              }}
            >
              Orders sync, labels print
            </h3>
            <p
              style={{
                margin: 0,
                font: "400 14px/1.5 var(--font-inter)",
                color: ds.muted,
              }}
            >
              Addresses, weights and items flow in automatically. Print in a
              click; tracking posts back to the order.
            </p>
          </div>

          {/* Small card 4 */}
          <div
            style={{
              gridColumn: "span 2",
              background: ds.white,
              border: `1px solid ${ds.border}`,
              borderRadius: 16,
              padding: 28,
              boxShadow: "0 1px 2px rgba(28,30,61,0.06)",
            }}
            className="why-card-small"
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#FFF3EE",
                display: "grid",
                placeItems: "center",
                marginBottom: 16,
              }}
            >
              <Image
                src="/shopify/icon-helps.svg"
                alt=""
                width={28}
                height={28}
              />
            </div>
            <h3
              style={{
                margin: "0 0 8px",
                font: "700 18px/1.3 var(--font-manrope)",
                color: ds.navy,
              }}
            >
              No fees, Heroic support
            </h3>
            <p
              style={{
                margin: 0,
                font: "400 14px/1.5 var(--font-inter)",
                color: ds.muted,
              }}
            >
              No monthly fee, no per-label fee. Reach real bilingual humans by
              phone or chat whenever a shipment needs a hand.
            </p>
          </div>

          {/* Small card 5 */}
          <div
            style={{
              gridColumn: "span 2",
              background: ds.white,
              border: `1px solid ${ds.border}`,
              borderRadius: 16,
              padding: 28,
              boxShadow: "0 1px 2px rgba(28,30,61,0.06)",
            }}
            className="why-card-small"
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#FFF3EE",
                display: "grid",
                placeItems: "center",
                marginBottom: 16,
              }}
            >
              <Image
                src="/shopify/icon-byor.svg"
                alt=""
                width={28}
                height={28}
              />
            </div>
            <h3
              style={{
                margin: "0 0 8px",
                font: "700 18px/1.3 var(--font-manrope)",
                color: ds.navy,
              }}
            >
              Bring your own rates
            </h3>
            <p
              style={{
                margin: 0,
                font: "400 14px/1.5 var(--font-inter)",
                color: ds.muted,
              }}
            >
              Already negotiated your own carrier pricing? Plug those accounts
              in and keep every discount you've earned.
            </p>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section
        id="how"
        style={{
          background: "#FCFCFC",
          borderTop: `1px solid ${ds.border}`,
          borderBottom: `1px solid ${ds.border}`,
        }}
      >
        <div
          style={{ maxWidth: 1200, margin: "0 auto", padding: "90px 32px" }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                font: "700 13px/1.2 var(--font-inter)",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: ds.orange,
              }}
            >
              Switch in minutes
            </div>
            <h2
              style={{
                margin: "14px auto 0",
                font: "800 clamp(1.8rem,4vw,46px)/1.12 var(--font-manrope)",
                letterSpacing: "-0.02em",
                color: ds.navy,
                maxWidth: "20ch",
              }}
            >
              Three steps from install to first cheaper label
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
              marginTop: 52,
            }}
            className="steps-grid"
          >
            {[
              {
                n: "1",
                title: "Install from the App Store",
                body: "Add the ShipTime app to your Shopify store and connect in one click. No code, no migration, no contract.",
              },
              {
                n: "2",
                title: "Your orders sync automatically",
                body: "Every new Shopify order arrives ready to ship — addresses, weights and contents pre-filled, nothing to retype.",
              },
              {
                n: "3",
                title: "Compare, print & track",
                body: `Pick the best of ${CARRIER_COUNT}+ live rates, print the label, and ShipTime pushes tracking back to the customer.`,
              },
            ].map((step) => (
              <div
                key={step.n}
                style={{
                  background: ds.white,
                  border: `1px solid ${ds.border}`,
                  borderRadius: 16,
                  padding: "34px 30px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    font: "800 17px/1 var(--font-manrope)",
                    color: ds.white,
                    background: ds.orange,
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {step.n}
                </div>
                <h3
                  style={{
                    margin: "22px 0 8px",
                    font: "700 22px/1.25 var(--font-manrope)",
                    color: ds.navy,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    font: "400 15px/1.55 var(--font-inter)",
                    color: ds.muted,
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 44 }}>
            <a
              href={SHOPIFY_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 11,
                font: "600 17px/1 var(--font-inter)",
                padding: "17px 30px",
                background: ds.orange,
                color: ds.white,
                border: 0,
                borderRadius: 12,
                cursor: "pointer",
                boxShadow: "0 12px 28px rgba(236,90,38,0.28)",
                textDecoration: "none",
              }}
            >
              <ShopifyLogo size={20} />
              Install on Shopify
            </a>
          </div>
        </div>
      </section>

      {/* ─── TOOLS GRID ─── */}
      <section
        id="tools"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 32px" }}
      >
        <div
          style={{
            font: "700 13px/1.2 var(--font-inter)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: ds.orange,
          }}
        >
          Everything in one app
        </div>
        <h2
          style={{
            margin: "14px 0 0",
            font: "800 clamp(1.8rem,4vw,46px)/1.12 var(--font-manrope)",
            letterSpacing: "-0.02em",
            color: ds.navy,
            maxWidth: "20ch",
          }}
        >
          Not just rates — the whole post-purchase toolkit
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 18,
            marginTop: 44,
          }}
          className="tools-grid"
        >
          {[
            {
              icon: "/shopify/icon-tracking.svg",
              title: "Branded tracking",
              body: "Keep customers in your brand with tracking pages and proactive status emails.",
            },
            {
              icon: "/shopify/icon-returns.svg",
              title: "Easy returns",
              body: "Generate prepaid return labels in seconds and turn returns into repeat sales.",
            },
            {
              icon: "/shopify/icon-insurance.svg",
              title: "Shipment insurance",
              body: "Protect high-value parcels with affordable coverage and fast, fair claims.",
            },
            {
              icon: "/shopify/icon-api.svg",
              title: "Shipping API",
              body: "Automate at scale and wire ShipTime rates into your own tools and workflows.",
            },
          ].map((tool) => (
            <div
              key={tool.title}
              style={{
                background: ds.white,
                border: `1px solid ${ds.border}`,
                borderRadius: 16,
                padding: 28,
                boxShadow: "0 1px 2px rgba(28,30,61,0.06)",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "#FFF3EE",
                  display: "grid",
                  placeItems: "center",
                  marginBottom: 16,
                }}
              >
                <Image
                  src={tool.icon}
                  alt=""
                  width={28}
                  height={28}
                />
              </div>
              <h3
                style={{
                  margin: "0 0 8px",
                  font: "700 18px/1.3 var(--font-manrope)",
                  color: ds.navy,
                }}
              >
                {tool.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  font: "400 14px/1.5 var(--font-inter)",
                  color: ds.muted,
                }}
              >
                {tool.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── STATS BAND ─── */}
      <section style={{ background: ds.navy }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "72px 32px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
          className="stats-grid"
        >
          {[
            {
              value: SAVINGS_PCT,
              suffix: "%",
              label: "Average savings off retail courier rates",
            },
            {
              value: CARRIER_COUNT,
              suffix: "+",
              label: "Courier & LTL services in one platform",
            },
            {
              value: COUNTRIES_COUNT,
              suffix: "+",
              label: "Countries reachable through our network",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{ borderLeft: `3px solid ${ds.orange}`, paddingLeft: 24 }}
            >
              <div
                style={{
                  font: "800 clamp(2.5rem,6vw,64px)/1 var(--font-manrope)",
                  letterSpacing: "-0.02em",
                  color: ds.white,
                }}
              >
                {stat.value}
                <em
                  style={{
                    fontStyle: "normal",
                    color: ds.orangeLight,
                  }}
                >
                  {stat.suffix}
                </em>
              </div>
              <div
                style={{
                  font: "600 15px/1.45 var(--font-inter)",
                  color: "#ABB2C6",
                  marginTop: 12,
                  maxWidth: "24ch",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section
        style={{
          position: "relative",
          background:
            "radial-gradient(circle at 85% 80%, rgba(236,90,38,0.18) 0%, transparent 45%), radial-gradient(circle at 10% 20%, rgba(5,127,242,0.16) 0%, transparent 50%), #16182F",
          overflow: "hidden",
        }}
      >
        <Image
          src="/shopify/world-map.svg"
          alt=""
          width={520}
          height={290}
          style={{
            position: "absolute",
            right: -60,
            bottom: -60,
            width: 520,
            opacity: 0.07,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            maxWidth: 1200,
            margin: "0 auto",
            padding: "100px 32px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: "0 auto",
              font: "800 clamp(2rem,5vw,52px)/1.1 var(--font-manrope)",
              letterSpacing: "-0.022em",
              color: ds.white,
              maxWidth: "20ch",
            }}
          >
            Start shipping smarter on Shopify today.
          </h2>
          <p
            style={{
              margin: "20px auto 0",
              font: "500 20px/1.55 var(--font-inter)",
              color: "#ABB2C6",
              maxWidth: "52ch",
            }}
          >
            Install free in minutes, sync your first order, and watch the
            cheapest reliable label appear before you've finished your coffee.
          </p>
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              marginTop: 36,
              flexWrap: "wrap",
            }}
          >
            <a
              href={SHOPIFY_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 11,
                font: "600 18px/1 var(--font-inter)",
                padding: "18px 32px",
                background: ds.orange,
                color: ds.white,
                border: 0,
                borderRadius: 12,
                cursor: "pointer",
                boxShadow: "0 12px 28px rgba(236,90,38,0.28)",
                textDecoration: "none",
              }}
            >
              <ShopifyLogo size={22} />
              Install on Shopify — Free
            </a>
            <a
              href="https://meetings-na3.hubspot.com/peter-sexton/meeting-with-peter"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                font: "600 18px/1 var(--font-inter)",
                padding: "18px 28px",
                background: "transparent",
                color: ds.white,
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 12,
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Talk to our team
            </a>
          </div>
          <div
            style={{
              font: "500 14px/1.4 var(--font-inter)",
              color: "#7D86A3",
              marginTop: 22,
            }}
          >
            Free to install · No monthly fee · No per-label fee · Cancel
            anytime
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        style={{
          background: "#FCFCFC",
          borderTop: `1px solid ${ds.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "64px 32px 36px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr repeat(4, 1fr)",
              gap: 32,
              paddingBottom: 36,
              borderBottom: `1px solid ${ds.border}`,
            }}
            className="footer-grid"
          >
            <div>
              <Image
                src="/shiptime-logo.svg"
                alt="ShipTime"
                width={120}
                height={30}
                style={{ height: 30, width: "auto" }}
              />
              <p
                style={{
                  font: "400 14px/1.55 var(--font-inter)",
                  color: ds.muted,
                  margin: "18px 0 0",
                  maxWidth: "32ch",
                }}
              >
                Canada's shipping aggregator for Shopify merchants. Compare{" "}
                {CARRIER_COUNT}+ courier and LTL services and save up to{" "}
                {SAVINGS_PCT}% on every label.
              </p>
            </div>

            {[
              {
                heading: "Product",
                links: [
                  "Courier rates",
                  "LTL freight",
                  "Branded tracking",
                  "Returns",
                ],
              },
              {
                heading: "Integrations",
                links: [
                  "Shopify",
                  "WooCommerce",
                  "BigCommerce",
                  "Shipping API",
                ],
              },
              {
                heading: "Carriers",
                links: [
                  "Canada Post",
                  "Purolator",
                  "FedEx · UPS",
                  "DHL · USPS",
                ],
              },
              {
                heading: "Company",
                links: ["About", "Heroic Support", "Pricing", "Careers"],
              },
            ].map((col) => (
              <div key={col.heading}>
                <h4
                  style={{
                    font: "700 12px/1 var(--font-inter)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: ds.orange,
                    margin: "0 0 16px",
                  }}
                >
                  {col.heading}
                </h4>
                {col.links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    style={{
                      display: "block",
                      font: "400 14px/1 var(--font-inter)",
                      color: ds.muted,
                      textDecoration: "none",
                      padding: "7px 0",
                    }}
                  >
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 24,
              font: "500 12px/1.4 var(--font-inter)",
              color: "#9296A8",
            }}
          >
            <span>© 2026 ShipTime Technologies Inc.</span>
            <span>Privacy · Terms · FR</span>
          </div>
        </div>
      </footer>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 900px) {
          .shopify-hero-grid {
            grid-template-columns: 1fr !important;
          }
          .why-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .why-card-big,
          .why-card-small {
            grid-column: span 1 !important;
          }
          .steps-grid,
          .tools-grid,
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .why-grid {
            grid-template-columns: 1fr !important;
          }
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
