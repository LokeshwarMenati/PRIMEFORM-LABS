"use client";

import React from "react";
import { useHmiStore } from "@/lib/store/hmi-store";
import { Power, Layers, FileCode, ArrowRight, ShieldAlert, FilePlus, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export const PowerOnStage: React.FC = () => {
  const {
    hmiState,
    goToStage,
    isActionLoading,
    setCustomInputModalOpen,
    setHowItWorksModalOpen,
  } = useHmiStore();

  if (!hmiState) return null;

  const { scenario } = hmiState;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Welcome Card */}
      <div className="rounded-xl border border-hmi-border bg-hmi-card p-6 shadow-hmi-card space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-hmi-primary pointer-events-none">
          <Power className="h-64 w-64" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hmi-border pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-hmi-primary/10 border border-hmi-primary/40 text-hmi-primary shadow-hmi-glow-cyan">
              <Power className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-mono text-hmi-text-dim uppercase tracking-wider block">
                STAGE 01 / 06 — STARTUP INITIALIZATION
              </span>
              <h2 className="text-2xl font-bold font-mono text-hmi-text">
                POWER ON & SCENARIO OVERVIEW
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCustomInputModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-hmi-primary/40 bg-hmi-primary/10 hover:bg-hmi-primary/20 text-hmi-primary font-mono text-xs font-bold transition-all shadow-hmi-glow-cyan"
            >
              <FilePlus className="h-4 w-4" />
              <span>+ Load Custom Job Order</span>
            </button>

            <button
              onClick={() => setHowItWorksModalOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-hmi-border bg-hmi-panel hover:bg-hmi-border text-hmi-text-muted hover:text-hmi-text font-mono text-xs transition-colors"
            >
              <HelpCircle className="h-4 w-4 text-hmi-accent" />
              <span>Watch Demo Guide</span>
            </button>
          </div>
        </div>

        <p className="text-sm text-hmi-text-muted leading-relaxed">
          Welcome to the Primeform Labs VMC Operator Interface. The machine control system is powered on and ready to guide you step-by-step through mandatory safety checks, tooling setup, workpiece positioning, and ready review.
        </p>

        {/* Scenario Details Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="rounded-lg border border-hmi-border bg-hmi-panel p-4 space-y-3">
            <div className="flex items-center space-x-2 text-hmi-primary text-xs font-mono font-bold">
              <Layers className="h-4 w-4" />
              <span>PART & MATERIAL SPECIFICATION</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between border-b border-hmi-border/40 pb-1">
                <span className="text-hmi-text-dim">Part Name:</span>
                <span className="text-hmi-text font-bold">{scenario.partName}</span>
              </div>
              <div className="flex justify-between border-b border-hmi-border/40 pb-1">
                <span className="text-hmi-text-dim">Part Number:</span>
                <span className="text-hmi-text font-bold">{scenario.partNumber}</span>
              </div>
              <div className="flex justify-between border-b border-hmi-border/40 pb-1">
                <span className="text-hmi-text-dim">Material:</span>
                <span className="text-hmi-text font-bold">{scenario.material}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-hmi-text-dim">Drawing Revision:</span>
                <span className="text-hmi-text font-bold">{scenario.drawingRevision}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-hmi-border bg-hmi-panel p-4 space-y-3">
            <div className="flex items-center space-x-2 text-hmi-primary text-xs font-mono font-bold">
              <FileCode className="h-4 w-4" />
              <span>CNC PROGRAM & WORKHOLDING</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between border-b border-hmi-border/40 pb-1">
                <span className="text-hmi-text-dim">Operation Name:</span>
                <span className="text-hmi-text font-bold">{scenario.operationName}</span>
              </div>
              <div className="flex justify-between border-b border-hmi-border/40 pb-1">
                <span className="text-hmi-text-dim">CNC Program:</span>
                <span className="text-hmi-primary font-bold">{scenario.cncProgram} ({scenario.cncRevision})</span>
              </div>
              <div className="flex justify-between border-b border-hmi-border/40 pb-1">
                <span className="text-hmi-text-dim">Work Offset:</span>
                <span className="text-hmi-success font-bold">{scenario.workOffset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-hmi-text-dim">Fixture:</span>
                <span className="text-hmi-text font-bold">{scenario.fixture}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-4 border-t border-hmi-border flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-400">
            <ShieldAlert className="h-4 w-4" />
            <span>Safety Rule: Machine checks must be completed sequentially.</span>
          </div>

          <button
            onClick={() => goToStage("MACHINE_CHECKS")}
            disabled={isActionLoading}
            className="flex items-center space-x-3 rounded-xl bg-hmi-primary hover:bg-hmi-primary-hover px-6 py-4 text-base font-bold text-hmi-bg font-mono shadow-hmi-glow-cyan transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>BEGIN MACHINE CHECKS</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
