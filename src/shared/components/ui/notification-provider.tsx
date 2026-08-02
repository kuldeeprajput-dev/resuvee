"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, X, Trash2 } from "lucide-react";
import { useNotification } from "@/shared/lib/use-notification";
import { cn } from "@/shared/lib/utils";

export function NotificationProvider() {
  const { toasts, removeToast, confirmDialog, closeConfirm } = useNotification();

  return (
    <>
      {/* Toast Popups Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          const isError = toast.type === "error";
          const isSuccess = toast.type === "success";

          return (
            <div
              key={toast.id}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-2xl p-4 shadow-xl border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-5",
                isError
                  ? "bg-red-950/95 border-red-800/50 text-white"
                  : isSuccess
                    ? "bg-emerald-950/95 border-emerald-800/50 text-white"
                    : "bg-[#1f2421]/95 border-black/20 text-white"
              )}
            >
              <div className="shrink-0 mt-0.5">
                {isError ? (
                  <AlertCircle className="size-5 text-red-400" />
                ) : isSuccess ? (
                  <CheckCircle2 className="size-5 text-emerald-400" />
                ) : (
                  <Info className="size-5 text-emerald-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold tracking-wide">{toast.title}</h4>
                {toast.message && (
                  <p className="text-[11px] text-white/80 mt-0.5 leading-relaxed">
                    {toast.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 size-6 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal Container */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-black/15 bg-[#f8f7f2] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-2xl border",
                  confirmDialog.variant === "danger"
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-emerald-50 border-emerald-200 text-emerald-800"
                )}
              >
                {confirmDialog.variant === "danger" ? (
                  <Trash2 className="size-6" />
                ) : (
                  <AlertCircle className="size-6" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-[var(--brand-ink)]">
                  {confirmDialog.title}
                </h3>
                <p className="text-xs text-[var(--brand-muted)] mt-1 leading-relaxed">
                  {confirmDialog.message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-black/10">
              <button
                type="button"
                onClick={closeConfirm}
                className="h-9 rounded-xl border border-black/15 bg-white px-4 text-xs font-bold text-[var(--brand-ink)] hover:bg-black/5 transition cursor-pointer"
              >
                {confirmDialog.cancelText || "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmDialog.onConfirm();
                  closeConfirm();
                }}
                className={cn(
                  "h-9 rounded-xl px-4 text-xs font-bold text-white shadow-sm transition cursor-pointer",
                  confirmDialog.variant === "danger"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-800 hover:bg-emerald-900"
                )}
              >
                {confirmDialog.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
