// Google Ads account constants and enhanced-conversion helpers, shared by the
// tracking stack (components/tracking.tsx) and the signup form.
//
// The conversion ID is public — it sits in the HTML of every page that runs the
// Ads tag — and was read from ShipTime's own GTM container (GTM-WHNCFPN3). That
// container holds five conversion actions, every one with enhanced conversions
// switched OFF, so Google has never been given a way to tie a click to a person.
// This module is what changes that for signups completed on these pages.
export const ADS_CONVERSION_ID = "AW-647302380";

// Conversion label of the *signup* action: Google Ads → Goals → Conversions →
// (the action) → Tag setup, the part after the slash in "AW-647302380/XXXX".
// NEXT_PUBLIC_ so it's inlined at build time — changing it needs a redeploy.
// Unset means no Ads conversion fires at all: a conversion sent to the wrong
// action pollutes the account, sending nothing just delays the data.
export const ADS_SIGNUP_LABEL = process.env.NEXT_PUBLIC_ADS_SIGNUP_LABEL ?? "";

export function adsSignupSendTo(): string | null {
  return ADS_SIGNUP_LABEL ? `${ADS_CONVERSION_ID}/${ADS_SIGNUP_LABEL}` : null;
}

// Google's normalisation for hashed-email matching: trim, lowercase, and for
// gmail.com / googlemail.com remove the dots in the local part. The offline
// upload (scripts/ads-first-shipment-export.mjs) applies this identical rule, so
// the hash Google stores at signup equals the hash we send at first shipment.
// Change one, change both.
export function normalizeEmail(raw: string): string {
  let e = raw.trim().toLowerCase();
  const at = e.lastIndexOf("@");
  if (at > 0) {
    const local = e.slice(0, at);
    const domain = e.slice(at + 1);
    if (domain === "gmail.com" || domain === "googlemail.com") {
      e = `${local.replace(/\./g, "")}@${domain}`;
    }
  }
  return e;
}

export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
