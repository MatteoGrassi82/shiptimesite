"use client";

// Low-commitment lead capture: replaces the external "sign up" redirect on the
// comparison pages with an inline popup. Just an email — no account creation,
// no call booked. Submission is stubbed (onSubmit prop) until a real
// destination (CRM/API route) is wired up.

import { useState } from "react";
import { Icon } from "@/components/ui/icons";

const ds = {
  navy: "#1C1E3D",
  muted: "#6E728A",
  orange: "#EC5A26",
  border: "#E8E8E8",
  surface: "#F8FAFB",
  white: "#FFFFFF",
};
const sora = { fontFamily: "var(--font-manrope), sans-serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };

type Variant = "light" | "dark";

async function submitLead(email: string, source: string) {
  // Stub: no backend wired yet. Swap this for a real API route/CRM call.
  await new Promise((r) => setTimeout(r, 400));
  return { ok: true, email, source };
}

function LeadCaptureModal({ source, onClose }: { source: string; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await submitLead(email.trim(), source);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center px-5"
      style={{ background: "rgba(28,30,61,0.45)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full"
        style={{ maxWidth: 420, background: ds.white, borderRadius: 20, padding: "36px 32px", boxShadow: "0 30px 80px rgba(28,30,61,0.35)" }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute flex items-center justify-center transition-opacity hover:opacity-70"
          style={{ top: 16, right: 16, width: 30, height: 30, borderRadius: "50%", background: ds.surface }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke={ds.muted} strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        {status === "done" ? (
          <div className="text-center py-4">
            <div className="mx-auto mb-5 flex items-center justify-center" style={{ width: 52, height: 52, borderRadius: "50%", background: "#EAF7EE" }}>
              <Icon.Check size={24} style={{ stroke: "#3FA864" }} />
            </div>
            <h3 className="mb-2" style={{ ...sora, fontWeight: 800, fontSize: 20, color: ds.navy }}>You&rsquo;re on the list</h3>
            <p style={{ ...inter, fontSize: 14.5, color: ds.muted, lineHeight: 1.6 }}>
              No forms, no calls yet — someone from our team will reach out to {email}.
            </p>
          </div>
        ) : (
          <>
            <h3 className="mb-2" style={{ ...sora, fontWeight: 800, fontSize: 21, color: ds.navy, letterSpacing: "-0.01em" }}>
              Leave your email
            </h3>
            <p className="mb-6" style={{ ...inter, fontSize: 14.5, color: ds.muted, lineHeight: 1.6 }}>
              No account to create, no call to book. Drop your email and someone from our team will reach out.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                required
                autoFocus
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm outline-none transition-colors"
                style={{ ...inter, borderRadius: 12, border: `1.5px solid ${ds.border}`, color: ds.navy }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full text-white text-sm font-semibold py-3.5 transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: ds.orange, borderRadius: 999, ...sora }}
              >
                {status === "loading" ? "Sending…" : "Get in touch"}
              </button>
              {status === "error" && (
                <p style={{ ...inter, fontSize: 12.5, color: "#D9534F" }}>Something went wrong — try again in a moment.</p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// Drop-in replacement for the old external signup <a>. Renders the same kind
// of button (pass className/style like before) and opens the modal on click.
export function LeadCaptureButton({
  source,
  children,
  className,
  style,
}: {
  source: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className} style={style}>
        {children}
      </button>
      {open && <LeadCaptureModal source={source} onClose={() => setOpen(false)} />}
    </>
  );
}
