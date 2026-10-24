"use client";

import { createContext, useContext, useEffect } from "react";
import { CircleCheck } from "lucide-react";
import { T } from "./ui";

// ── Confirmations ────────────────────────────────────────────────────────────
// Every action says what happened and, where there's somewhere to go next,
// offers it ("Sent to Priya · first reply by 12:42 pm · View").

export type Toast = { text: string; action?: { label: string; onClick: () => void } };
export const ToastContext = createContext<(t: Toast) => void>(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastView({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  return (
    <div role="status" className="fixed bottom-5 left-1/2 z-[90] flex max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-3 rounded-lg bg-[color:var(--c-ink)] px-4 py-2.5 text-[14px] text-white shadow-[0_15px_35px_rgba(0,0,0,.25)]" style={{ fontFamily: T.font }}>
      <CircleCheck className="h-4 w-4 shrink-0 text-[#4ADE80]" />
      <span>{toast.text}</span>
      {toast.action && <button type="button" onClick={() => { toast.action!.onClick(); onClose(); }} className="shrink-0 font-semibold text-[color:var(--c-toast-action)] hover:underline">{toast.action.label}</button>}
    </div>
  );
}
