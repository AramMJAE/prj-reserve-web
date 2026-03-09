"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

export default function Toast() {
  const toast = useStore((s) => s.toast);
  const hideToast = useStore((s) => s.hideToast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
      <div
        className={cn(
          "px-5 py-3 rounded-card shadow-lg text-[14px] font-medium text-white",
          toast.type === "success" && "bg-success",
          toast.type === "error" && "bg-error",
          toast.type === "info" && "bg-primary"
        )}
      >
        {toast.message}
      </div>
    </div>
  );
}
