"use client";

import React from "react";
import { useHmiStore } from "@/lib/store/hmi-store";
import { Box, CheckCircle2, OctagonAlert, ArrowRight, Check, Move3D, Layers, Anchor, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const WorkpieceStage: React.FC = () => {
  const {
    hmiState,
    confirmWorkpieceCheck,
    goToStage,
    isActionLoading,
  } = useHmiStore();

  if (!hmiState) return null;

  const { workpieceChecks, stats, scenario, workflow } = hmiState;

  const activeIndex = Math.min(workflow.currentItemIndex, workpieceChecks.length - 1);
  const currentStep = workpieceChecks[activeIndex] || workpieceChecks[0];

  const allWorkpieceConfirmed = stats.workpieceConfirmedCount === stats.workpieceTotalCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-hmi-card p-4 rounded-xl border border-hmi-border shadow-hmi-card">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-hmi-primary/10 border border-hmi-primary/30 text-hmi-primary">
            <Box className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-hmi-text-dim uppercase tracking-wider block">
              STAGE 04 / 06 — WORKHOLDING & DATUM
            </span>
            <h2 className="text-xl font-bold font-mono text-hmi-text">
              WORKPIECE SETUP
            </h2>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-4 bg-hmi-panel px-4 py-2 rounded-lg border border-hmi-border">
          <div className="text-right font-mono">
            <span className="text-[10px] text-hmi-text-dim block">SETUP PROGRESS</span>
            <span className="text-sm font-bold text-hmi-success">
              {stats.workpieceConfirmedCount} / {stats.workpieceTotalCount} COMPLETE
            </span>
          </div>
          <div className="w-24 bg-hmi-border h-2 rounded-full overflow-hidden">
            <div
              className="bg-hmi-success h-full transition-all duration-500"
              style={{
                width: `${(stats.workpieceConfirmedCount / stats.workpieceTotalCount) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side Checklist Steps */}
        <div className="md:col-span-1 space-y-2">
          <h3 className="text-xs font-mono text-hmi-text-dim uppercase tracking-wider mb-2 px-1">
            WORKPIECE STEPS
          </h3>

          {workpieceChecks.map((w, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={w.id}
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
                    : w.confirmed
                    ? "border-hmi-success/30 bg-hmi-panel text-hmi-text-muted"
                    : "border-hmi-border bg-hmi-card text-hmi-text-dim"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-bold">0{idx + 1}</span>
                  <span className="text-xs truncate max-w-[130px]">{w.stepName}</span>
                </div>

                {w.confirmed ? (
                  <CheckCircle2 className="h-4 w-4 text-hmi-success flex-shrink-0" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-amber-400 flex-shrink-0 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Side Active Step Card */}
        <div className="md:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="rounded-xl border border-hmi-border bg-hmi-card p-6 shadow-hmi-card space-y-6"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-hmi-border pb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-hmi-primary/20 text-hmi-primary font-mono text-xs font-bold border border-hmi-primary/30">
                    STEP 0{activeIndex + 1}
                  </span>
                  <span className="text-xs font-mono text-hmi-text-dim uppercase">
                    WORKPIECE ARRANGEMENT
                  </span>
                </div>

                <div
                  className={`px-3 py-1 rounded font-mono text-xs font-bold flex items-center space-x-1.5 ${
                    currentStep.confirmed
                      ? "bg-hmi-success/10 text-hmi-success border border-hmi-success/30"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {currentStep.confirmed ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>STEP CONFIRMED</span>
                    </>
                  ) : (
                    <>
                      <OctagonAlert className="h-3.5 w-3.5" />
                      <span>ACTION REQUIRED</span>
                    </>
                  )}
                </div>
              </div>

              {/* Central Step Focus */}
              <div className="rounded-xl border border-hmi-border bg-hmi-panel p-5 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-hmi-primary/20 text-hmi-primary border border-hmi-primary/30">
                    <Move3D className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-mono text-hmi-text">
                      {currentStep.stepName}
                    </h3>
                    <p className="text-xs text-hmi-text-muted font-sans">
                      {currentStep.instruction}
                    </p>
                  </div>
                </div>

                {/* Technical Specifications Matrix */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-hmi-border/60 text-xs font-mono">
                  <div className="bg-hmi-card p-2.5 rounded border border-hmi-border space-y-1">
                    <span className="text-hmi-text-dim block flex items-center space-x-1">
                      <Anchor className="h-3 w-3 text-hmi-primary" />
                      <span>FIXTURE</span>
                    </span>
                    <span className="text-hmi-text font-bold block">{scenario.fixture}</span>
                  </div>

                  <div className="bg-hmi-card p-2.5 rounded border border-hmi-border space-y-1">
                    <span className="text-hmi-text-dim block flex items-center space-x-1">
                      <Compass className="h-3 w-3 text-hmi-success" />
                      <span>WORK OFFSET</span>
                    </span>
                    <span className="text-hmi-success font-bold block">{scenario.workOffset}</span>
                  </div>

                  <div className="bg-hmi-card p-2.5 rounded border border-hmi-border space-y-1">
                    <span className="text-hmi-text-dim block flex items-center space-x-1">
                      <Layers className="h-3 w-3 text-hmi-primary" />
                      <span>STOCK MATERIAL</span>
                    </span>
                    <span className="text-hmi-text font-bold block">{scenario.material}</span>
                  </div>

                  <div className="bg-hmi-card p-2.5 rounded border border-hmi-border space-y-1">
                    <span className="text-hmi-text-dim block">DRAWING REF</span>
                    <span className="text-hmi-text font-bold block">
                      {scenario.partNumber} ({scenario.drawingRevision})
                    </span>
                  </div>
                </div>

                {currentStep.confirmed && currentStep.confirmedBy && (
                  <div className="pt-2 border-t border-hmi-success/20 text-xs font-mono text-hmi-success">
                    Verified by <span className="font-bold">{currentStep.confirmedBy}</span> at{" "}
                    {currentStep.confirmedAt
                      ? new Date(currentStep.confirmedAt).toLocaleTimeString("en-US", { hour12: false })
                      : "recently"}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div>
                {!currentStep.confirmed ? (
                  <button
                    onClick={() => confirmWorkpieceCheck(currentStep.id)}
                    disabled={isActionLoading}
                    className="w-full flex items-center justify-center space-x-2 rounded-xl bg-hmi-success hover:bg-emerald-600 min-h-[52px] text-base font-bold text-hmi-bg font-mono shadow-hmi-glow-green transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Check className="h-5 w-5 stroke-[3]" />
                    <span>CONFIRM WORKPIECE SETUP STEP</span>
                  </button>
                ) : (
                  <div className="w-full text-center py-3 bg-hmi-panel rounded-xl border border-hmi-border text-xs font-mono text-hmi-text-muted">
                    ✓ Step confirmed. Workpiece alignment and clamping locked.
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progression */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-hmi-text-dim">
              {!allWorkpieceConfirmed
                ? `Confirm all ${stats.workpieceTotalCount} steps to unlock Ready Review.`
                : "Workpiece setup fully confirmed!"}
            </span>

            <button
              onClick={() => goToStage("READY")}
              disabled={!allWorkpieceConfirmed || isActionLoading}
              className={`flex items-center space-x-2 rounded-xl px-6 py-3 font-mono text-sm font-bold transition-all ${
                allWorkpieceConfirmed
                  ? "bg-hmi-primary hover:bg-hmi-primary-hover text-hmi-bg shadow-hmi-glow-cyan cursor-pointer"
                  : "bg-hmi-border/40 text-hmi-text-dim cursor-not-allowed border border-hmi-border/50"
              }`}
            >
              <span>NEXT: READY REVIEW</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
