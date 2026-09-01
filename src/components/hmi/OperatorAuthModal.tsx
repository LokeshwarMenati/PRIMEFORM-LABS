"use client";

import React, { useState } from "react";
import { useHmiStore } from "@/lib/store/hmi-store";
import { UserCheck, Shield, LogOut, Check, Lock, UserPlus, HelpCircle } from "lucide-react";

export const OperatorAuthModal: React.FC = () => {
  const {
    isDemoAuthModalOpen,
    setDemoAuthModalOpen,
    operatorName,
    setOperatorName,
    setHowItWorksModalOpen,
    showToast,
  } = useHmiStore();

  const [inputName, setInputName] = useState(operatorName);
  const [badgeId, setBadgeId] = useState("OP-5049");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  if (!isDemoAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      setOperatorName(inputName.trim());
      showToast("success", `Signed in as Certified Operator: ${inputName.trim()} (${badgeId})`);
      setDemoAuthModalOpen(false);
    }
  };

  const handleSignOut = () => {
    setOperatorName("Unassigned Operator");
    showToast("info", "Operator signed out of workstation session");
    setDemoAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-md rounded-xl border border-hmi-border bg-hmi-panel p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-hmi-border pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-hmi-primary/10 border border-hmi-primary/30 text-hmi-primary">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-hmi-text font-mono">
              {isCreatingAccount ? "REGISTER NEW OPERATOR" : "OPERATOR AUTHENTICATION"}
            </h3>
            <p className="text-xs text-hmi-text-dim">
              Workstation VMC-01 Security & Session Control
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-hmi-text-muted mb-1 uppercase">
              Operator Full Name
            </label>
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full rounded-lg border border-hmi-border bg-hmi-card px-3 py-2 text-sm text-hmi-text font-mono focus:border-hmi-primary focus:outline-none"
              placeholder="e.g. John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-hmi-text-muted mb-1 uppercase">
              Operator Badge ID / Pin
            </label>
            <input
              type="text"
              value={badgeId}
              onChange={(e) => setBadgeId(e.target.value)}
              className="w-full rounded-lg border border-hmi-border bg-hmi-card px-3 py-2 text-sm text-hmi-text font-mono focus:border-hmi-primary focus:outline-none"
              placeholder="OP-XXXX"
              required
            />
          </div>

          <div className="rounded-lg border border-hmi-border bg-hmi-card p-3 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-hmi-text-muted">
              <span>Current Session:</span>
              <span className="text-hmi-primary font-bold">{operatorName}</span>
            </div>
            <div className="flex items-center justify-between text-hmi-text-muted">
              <span>Workstation ID:</span>
              <span className="text-hmi-success font-bold">VMC-01</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col space-y-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 rounded-lg bg-hmi-primary hover:bg-hmi-primary-hover px-4 py-2.5 text-sm font-bold text-hmi-bg font-mono shadow-hmi-glow-cyan transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>{isCreatingAccount ? "CREATE ACCOUNT & SIGN IN" : "SIGN IN OPERATOR SESSION"}</span>
            </button>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  setDemoAuthModalOpen(false);
                  setHowItWorksModalOpen(true);
                }}
                className="flex-1 flex items-center justify-center space-x-1.5 rounded-lg border border-hmi-border bg-hmi-card hover:bg-hmi-border px-3 py-2 text-xs font-mono text-hmi-text-muted transition-colors"
              >
                <HelpCircle className="h-3.5 w-3.5 text-hmi-accent" />
                <span>Watch How It Works</span>
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center justify-center space-x-1 rounded-lg border border-hmi-danger/40 bg-hmi-danger/10 hover:bg-hmi-danger/20 px-3 py-2 text-xs font-mono text-hmi-danger transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsCreatingAccount(!isCreatingAccount)}
              className="py-1 text-center text-xs text-hmi-primary hover:underline font-mono"
            >
              {isCreatingAccount ? "Back to Sign In" : "+ Create New Operator Account"}
            </button>

            <button
              type="button"
              onClick={() => setDemoAuthModalOpen(false)}
              className="py-1 text-xs text-hmi-text-dim hover:text-hmi-text font-mono transition-colors"
            >
              Cancel / Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
