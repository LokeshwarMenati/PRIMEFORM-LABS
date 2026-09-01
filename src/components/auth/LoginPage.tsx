"use client";

import React, { useState } from "react";
import { useHmiStore } from "@/lib/store/hmi-store";
import { Cpu, ShieldCheck, UserCheck, PlayCircle, Lock, ArrowRight, Sparkles, Check, Key } from "lucide-react";
import { motion } from "framer-motion";

export const LoginPage: React.FC = () => {
  const { login, setHowItWorksModalOpen, showToast } = useHmiStore();

  const [operatorName, setOperatorNameInput] = useState("Demo Operator");
  const [badgeId, setBadgeIdInput] = useState("OP-5049");
  const [pinPassword, setPinPassword] = useState("••••••");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (operatorName.trim()) {
      login(operatorName.trim(), badgeId.trim() || "OP-5049");
    }
  };

  const handleDemoSignIn = () => {
    login("Demo Operator", "OP-5049");
    showToast("success", "Welcome! Signed in as Certified VMC Demo Operator (OP-5049)");
  };

  return (
    <div className="min-h-screen bg-hmi-bg text-hmi-text flex flex-col items-center justify-center p-4 selection:bg-hmi-primary selection:text-hmi-bg font-mono select-none">
      {/* Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg rounded-2xl border border-hmi-border bg-hmi-panel p-8 shadow-2xl space-y-6 relative overflow-hidden"
      >
        {/* Glow Accents */}
        <div className="absolute top-0 right-0 p-12 opacity-5 text-hmi-primary pointer-events-none">
          <Cpu className="h-64 w-64" />
        </div>

        {/* Top Header */}
        <div className="flex items-center space-x-3 border-b border-hmi-border pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-hmi-primary/10 border border-hmi-primary/40 text-hmi-primary shadow-hmi-glow-cyan">
            <Cpu className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-widest text-hmi-text text-lg">
                PRIMEFORM LABS
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-hmi-border text-hmi-text-muted font-bold">
                v2.4
              </span>
            </div>
            <p className="text-xs text-hmi-text-dim uppercase tracking-wider">
              VMC-01 Operator Workstation Authentication
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-hmi-text-muted mb-1 uppercase">
              Operator Full Name / Badge Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorNameInput(e.target.value)}
                className="w-full rounded-xl border border-hmi-border bg-hmi-card px-4 py-3 text-sm text-hmi-text font-mono focus:border-hmi-primary focus:outline-none transition-colors"
                placeholder="e.g. Demo Operator"
                required
              />
              <UserCheck className="absolute right-3.5 top-3.5 h-4 w-4 text-hmi-text-dim" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-hmi-text-muted mb-1 uppercase">
                Badge ID / Operator PIN
              </label>
              <input
                type="text"
                value={badgeId}
                onChange={(e) => setBadgeIdInput(e.target.value)}
                className="w-full rounded-xl border border-hmi-border bg-hmi-card px-3 py-2.5 text-xs text-hmi-primary font-bold focus:border-hmi-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-hmi-text-muted mb-1 uppercase">
                Security Password
              </label>
              <input
                type="password"
                value={pinPassword}
                onChange={(e) => setPinPassword(e.target.value)}
                className="w-full rounded-xl border border-hmi-border bg-hmi-card px-3 py-2.5 text-xs text-hmi-text focus:border-hmi-primary focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Machine Info Box */}
          <div className="rounded-xl border border-hmi-border bg-hmi-card p-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-hmi-text-muted">
              <span>WORKSTATION:</span>
              <span className="text-hmi-primary font-bold">VMC-01 (Primeform 500)</span>
            </div>
            <div className="flex justify-between text-hmi-text-muted">
              <span>PRIVILEGE LEVEL:</span>
              <span className="text-hmi-success font-bold">Certified VMC Operator</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-hmi-primary hover:bg-hmi-primary-hover min-h-[48px] text-sm font-bold text-hmi-bg font-mono shadow-hmi-glow-cyan transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>SIGN IN TO WORKSTATION</span>
            </button>

            {/* Quick Demo Operator Button */}
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="w-full flex items-center justify-center space-x-2 rounded-xl border border-hmi-success/40 bg-hmi-success/10 hover:bg-hmi-success/20 py-2.5 text-xs font-bold text-hmi-success font-mono transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>ONE-CLICK SIGN IN AS DEMO OPERATOR</span>
            </button>

            {/* Watch How It Works / Demo Video */}
            <button
              type="button"
              onClick={() => setHowItWorksModalOpen(true)}
              className="w-full flex items-center justify-center space-x-2 rounded-xl border border-hmi-border bg-hmi-card hover:bg-hmi-border py-2.5 text-xs text-hmi-text-muted hover:text-hmi-text font-mono transition-colors"
            >
              <PlayCircle className="h-4 w-4 text-hmi-accent" />
              <span>WATCH PROJECT DEMO & HOW IT WORKS</span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-hmi-border pt-4 text-center text-[11px] text-hmi-text-dim">
          Primeform Labs VMC Operator HMI Console — Software Simulation Platform
        </div>
      </motion.div>
    </div>
  );
};
