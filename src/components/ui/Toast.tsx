"use client";

import React, { useEffect } from "react";
import { useHmiStore } from "@/lib/store/hmi-store";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Toast: React.FC = () => {
  const { toast, clearToast } = useHmiStore();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      clearToast();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 rounded-lg border border-hmi-border bg-hmi-card px-4 py-3 shadow-2xl text-hmi-text"
        >
          {toast.type === "success" && (
            <CheckCircle2 className="h-5 w-5 text-hmi-success flex-shrink-0" />
          )}
          {toast.type === "error" && (
            <AlertTriangle className="h-5 w-5 text-hmi-danger flex-shrink-0" />
          )}
          {toast.type === "info" && (
            <Info className="h-5 w-5 text-hmi-primary flex-shrink-0" />
          )}
          <span className="text-sm font-medium tracking-wide">{toast.text}</span>
          <button
            onClick={clearToast}
            className="ml-2 text-hmi-text-dim hover:text-hmi-text transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
