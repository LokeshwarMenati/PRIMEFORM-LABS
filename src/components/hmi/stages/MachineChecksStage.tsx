"use client";

import React from "react";
import { useHmiStore } from "@/lib/store/hmi-store";
import { ShieldCheck, CheckCircle2, OctagonAlert, ArrowRight, Shield, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const MachineChecksStage: React.FC = () => {
  const {
    hmiState,
    confirmMachineCheck,
    goToStage,
    isActionLoading,
    operatorName,
  } = useHmiStore();

  if (!hmiState) return null;

  const { checks, stats, workflow } = hmiState;

  // Active check is either specified by currentItemIndex or first unconfirmed check
  const activeCheckIndex = Math.min(
    workflow.currentItemIndex,
    checks.length - 1
  );
  const currentCheck = checks[activeCheckIndex] || checks[0];

  const allChecksConfirmed = stats.checksConfirmedCount === stats.checksTotalCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Header & Overall Stage Progress */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-hmi-card p-4 rounded-xl border border-hmi-border shadow-hmi-card">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-hmi-primary/10 border border-hmi-primary/30 text-hmi-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-hmi-text-dim uppercase tracking-wider block">
              STAGE 02 / 06 — SAFETY & CONTROLS
            </span>
            <h2 className="text-xl font-bold font-mono text-hmi-text">
              MACHINE CHECKS
            </h2>
          </div>
        </div>

        {/* Progress Indicator Pill */}
        <div className="flex items-center space-x-4 bg-hmi-panel px-4 py-2 rounded-lg border border-hmi-border">
          <div className="text-right font-mono">
            <span className="text-[10px] text-hmi-text-dim block">CHECKS PROGRESS</span>
            <span className="text-sm font-bold text-hmi-success">
              {stats.checksConfirmedCount} / {stats.checksTotalCount} COMPLETE
            </span>
          </div>
          <div className="w-24 bg-hmi-border h-2 rounded-full overflow-hidden">
            <div
              className="bg-hmi-success h-full transition-all duration-500"
              style={{
                width: `${(stats.checksConfirmedCount / stats.checksTotalCount) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Focus Checklist Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Step Selection List */}
        <div className="md:col-span-1 space-y-2">
          <h3 className="text-xs font-mono text-hmi-text-dim uppercase tracking-wider mb-2 px-1">
            CHECKLIST SEQUENCE
          </h3>

          {checks.map((chk, idx) => {
            const isActive = idx === activeCheckIndex;
            return (
              <button
                key={chk.id}
                onClick={() => {
                  useHmiStore.setState((s) => {
                    if (s.hmiState) {
                      return {
                        hmiState: {
                          ...s.hmiState,
                          workflow: { ...s.hmiState.workflow, currentItemIndex: idx },
                        },
                      };
                    }
                    return s;
                  });
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg border text-left font-mono transition-all ${
                  isActive
                    ? "border-hmi-primary bg-hmi-primary/10 text-hmi-text shadow-hmi-glow-cyan"
                    : chk.confirmed
                    ? "border-hmi-success/30 bg-hmi-panel text-hmi-text-muted"
                    : "border-hmi-border bg-hmi-card text-hmi-text-dim"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-bold">{chk.code}</span>
                  <span className="text-xs truncate max-w-[130px]">{chk.title}</span>
                </div>

                {chk.confirmed ? (
                  <CheckCircle2 className="h-4 w-4 text-hmi-success flex-shrink-0" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-amber-400 flex-shrink-0 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Side: Active Check Focus Card */}
        <div className="md:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCheck.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="rounded-xl border border-hmi-border bg-hmi-card p-6 shadow-hmi-card space-y-6 relative"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-hmi-border pb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-hmi-primary/20 text-hmi-primary font-mono text-xs font-bold border border-hmi-primary/30">
                    {currentCheck.code}
                  </span>
                  <span className="text-xs font-mono text-hmi-text-dim uppercase">
                    CHECK {activeCheckIndex + 1} OF {checks.length}
                  </span>
                </div>

                <div
                  className={`px-3 py-1 rounded font-mono text-xs font-bold flex items-center space-x-1.5 ${
                    currentCheck.confirmed
                      ? "bg-hmi-success/10 text-hmi-success border border-hmi-success/30"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {currentCheck.confirmed ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>CONFIRMED</span>
                    </>
                  ) : (
                    <>
                      <OctagonAlert className="h-3.5 w-3.5" />
                      <span>WAITING CONFIRMATION</span>
                    </>
                  )}
                </div>
              </div>

              {/* Central Visual Focus Box */}
              <div
                className={`rounded-xl border p-8 text-center transition-all ${
                  currentCheck.confirmed
                    ? "border-hmi-success/40 bg-hmi-success/5"
                    : "border-amber-500/30 bg-amber-500/5 shadow-hmi-glow-amber"
                }`}
              >
                <div className="flex justify-center mb-4">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full border ${
                      currentCheck.confirmed
                        ? "bg-hmi-success/20 border-hmi-success text-hmi-success shadow-hmi-glow-green"
                        : "bg-amber-500/20 border-amber-500 text-amber-400 animate-pulse"
                    }`}
                  >
                    {currentCheck.confirmed ? (
                      <Check className="h-8 w-8 stroke-[3]" />
                    ) : (
                      <Shield className="h-8 w-8" />
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold font-mono text-hmi-text mb-2 uppercase">
                  {currentCheck.title}
                </h3>
                <p className="text-sm text-hmi-text-muted font-sans max-w-md mx-auto leading-relaxed">
                  {currentCheck.instruction}
                </p>

                {currentCheck.confirmed && currentCheck.confirmedBy && (
                  <div className="mt-4 pt-3 border-t border-hmi-success/20 text-xs font-mono text-hmi-success">
                    Confirmed by <span className="font-bold">{currentCheck.confirmedBy}</span> at{" "}
                    {currentCheck.confirmedAt
                      ? new Date(currentCheck.confirmedAt).toLocaleTimeString("en-US", { hour12: false })
                      : "recently"}
                  </div>
                )}
              </div>

              {/* Primary Confirmation Button */}
              <div>
                {!currentCheck.confirmed ? (
                  <button
                    onClick={() => confirmMachineCheck(currentCheck.id)}
                    disabled={isActionLoading}
                    className="w-full flex items-center justify-center space-x-2 rounded-xl bg-hmi-success hover:bg-emerald-600 min-h-[52px] text-base font-bold text-hmi-bg font-mono shadow-hmi-glow-green transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    <span>CONFIRM CHECK ({currentCheck.code})</span>
                  </button>
                ) : (
                  <div className="w-full text-center py-3 bg-hmi-panel rounded-xl border border-hmi-border text-xs font-mono text-hmi-text-muted">
                    ✓ Item confirmed. Target verified safe for operational cycle.
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Stage Progression Bar */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-hmi-text-dim">
              {!allChecksConfirmed
                ? `Confirm all ${stats.checksTotalCount} checks to unlock next stage.`
                : "All machine checks confirmed safe!"}
            </span>

            <button
              onClick={() => goToStage("TOOLS")}
              disabled={!allChecksConfirmed || isActionLoading}
              className={`flex items-center space-x-2 rounded-xl px-6 py-3 font-mono text-sm font-bold transition-all ${
                allChecksConfirmed
                  ? "bg-hmi-primary hover:bg-hmi-primary-hover text-hmi-bg shadow-hmi-glow-cyan cursor-pointer"
                  : "bg-hmi-border/40 text-hmi-text-dim cursor-not-allowed border border-hmi-border/50"
              }`}
            >
              <span>NEXT: REQUIRED TOOLS</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
