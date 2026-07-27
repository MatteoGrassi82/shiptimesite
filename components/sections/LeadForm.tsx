"use client";

import { useState, type FormEvent } from "react";

export type LeadField =
  | { name: string; label: string; type: "text" | "email"; required?: boolean; placeholder?: string }
  | { name: string; label: string; type: "select"; required?: boolean; options: string[] }
  | { name: string; label: string; type: "textarea"; required?: boolean; placeholder?: string };

// Single reusable lead-capture form. Posts to /api/lead (the real HubSpot sink
// — see app/api/lead/route.ts), not the stubbed modal pattern used elsewhere in
// the repo. `source` tags which page/flow the submission came from.
export function LeadForm({
  fields,
  source,
  submitLabel,
  successHeading,
  successBody,
}: {
  fields: LeadField[];
  source: string;
  submitLabel: string;
  successHeading: string;
  successBody: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, source }),
      });
      const data = await res.json();
      setStatus(data.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
        style={{
          borderRadius: "var(--radius-card)",
          border: "1px solid var(--line)",
          background: "var(--card)",
          padding: "32px 28px",
          textAlign: "center",
        }}
      >
        <h3 className="st-display" style={{ fontSize: 20, margin: "0 0 8px" }}>
          {successHeading}
        </h3>
        <p className="st-body" style={{ margin: 0, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.6 }}>
          {successBody}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: 16,
        borderRadius: "var(--radius-card)",
        border: "1px solid var(--line)",
        background: "var(--card)",
        padding: "28px 24px",
      }}
    >
      {fields.map((f) => (
        <label key={f.name} style={{ display: "grid", gap: 6 }}>
          <span className="st-body" style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}>
            {f.label}
            {f.required && " *"}
          </span>
          {f.type === "select" ? (
            <select
              required={f.required}
              value={values[f.name] || ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
              style={selectStyle}
            >
              <option value="" disabled>
                Select…
              </option>
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : f.type === "textarea" ? (
            <textarea
              required={f.required}
              placeholder={f.placeholder}
              rows={3}
              value={values[f.name] || ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
              style={{ ...inputStyle, resize: "vertical" as const }}
            />
          ) : (
            <input
              type={f.type}
              required={f.required}
              placeholder={f.placeholder}
              value={values[f.name] || ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
              style={inputStyle}
            />
          )}
        </label>
      ))}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="st-cta"
        style={{
          marginTop: 4,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          borderRadius: "var(--radius-pill)",
          background: "var(--brand)",
          color: "var(--on-brand)",
          padding: "14px 24px",
          fontSize: 15,
          fontWeight: 600,
          border: "none",
          cursor: status === "submitting" ? "wait" : "pointer",
          opacity: status === "submitting" ? 0.7 : 1,
        }}
      >
        {status === "submitting" ? "Sending…" : submitLabel}
      </button>
      {status === "error" && (
        <p className="st-body" style={{ margin: 0, fontSize: 13, color: "#c0392b" }}>
          Something went wrong — try again, or email us directly.
        </p>
      )}
    </form>
  );
}

const inputStyle = {
  border: "1px solid var(--line)",
  borderRadius: 10,
  padding: "11px 14px",
  fontSize: 14.5,
  fontFamily: "var(--font-body)",
  color: "var(--ink)",
  background: "var(--page)",
};

const selectStyle = { ...inputStyle, appearance: "auto" as const };
