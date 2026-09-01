"use client";

import React, { useState } from "react";
import { useHmiStore } from "@/lib/store/hmi-store";
import { UserCheck, Shield, LogOut, Check, Lock } from "lucide-react";

export const OperatorAuthModal: React.FC = () => {
  const {
    isDemoAuthModalOpen,
    setDemoAuthModalOpen,
    operatorName,
    setOperatorName,
    showToast,
  } = useHmiStore();

  const [inputName, setInputName] = useState(operatorName);

  if (!isDemoAuthModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      setOperatorName(inputName.trim());
      showToast("success", `Active operator set to: ${inputName.trim()}`);
      setDemoAuthModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-hmi-border bg-hmi-panel p-6 shadow-2xl">
        <div className="flex items-center space-x-3 border-b border-hmi-border pb-4 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-hmi-primary/10 border border-hmi-primary/30 text-hmi-primary">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-hmi-text font-mono">
              OPERATOR IDENTIFICATION
            </h3>
            <p className="text-xs text-hmi-text-dim">
              VMC-01 Workstation Audit & Session Control
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-hmi-text-muted mb-1 uppercase">
              Operator Full Name / Badge ID
            </label>
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full rounded-lg border border-hmi-border bg-hmi-card px-3 py-2 text-sm text-hmi-text font-mono focus:border-hmi-primary focus:outline-none"
              placeholder="Enter operator name..."
              required
            />
          </div>

          <div className="rounded-lg border border-hmi-border bg-hmi-card p-3 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-hmi-text-muted">
              <span>Workstation:</span>
              <span className="text-hmi-primary font-bold">VMC-01 (Machine 500)</span>
            </div>
            <div className="flex items-center justify-between text-hmi-text-muted">
              <span>Role Privilege:</span>
              <span className="text-hmi-success font-bold">Certified VMC Operator</span>
            </div>
            <div className="flex items-center justify-between text-hmi-text-muted">
              <span>Auth Provider:</span>
              <span className="text-hmi-text-dim">Local Demo Session (SSO Ready)</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col space-y-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 rounded-lg bg-hmi-primary hover:bg-hmi-primary-hover px-4 py-2.5 text-sm font-bold text-hmi-bg font-mono shadow-hmi-glow-cyan transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>CONFIRM OPERATOR SESSION</span>
            </button>

            <button
              type="button"
              onClick={() => {
                showToast("info", "Google OAuth SSO endpoint ready for production deployment");
              }}
              className="w-full flex items-center justify-center space-x-2 rounded-lg border border-hmi-border bg-hmi-card hover:bg-hmi-border px-4 py-2 text-xs font-mono text-hmi-text-muted transition-colors"
            >
              <Shield className="h-4 w-4 text-hmi-accent" />
              <span>Sign in with Google OAuth (Enterprise SSO)</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoAuthModalOpen(false)}
              className="w-full py-1.5 text-xs text-hmi-text-dim hover:text-hmi-text font-mono transition-colors"
            >
              Cancel / Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
