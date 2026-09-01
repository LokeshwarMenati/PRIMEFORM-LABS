"use client";

import React from "react";
import { useHmiStore } from "@/lib/store/hmi-store";
import { CheckCircle2, ShieldCheck, Wrench, Box, ArrowRight, Sparkles, FileCode } from "lucide-react";
import { motion } from "framer-motion";

export const ReadyReviewStage: React.FC = () => {
  const { hmiState, goToStage, isActionLoading } = useHmiStore();
  if (!hmiState) return null;

  const { stats, scenario } = hmiState;

  const isFullyPrepared = stats.isFullyPrepared;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Ready Banner */}
      <div className="rounded-xl border border-hmi-success/50 bg-hmi-success/10 p-6 shadow-hmi-glow-green text-center space-y-4 relative overflow-hidden">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-hmi-success text-hmi-bg shadow-hmi-glow-green">
            <Sparkles className="h-8 w-8 animate-pulse" />
          </div>
        </div>

        <div>
          <span className="text-xs font-mono text-hmi-success font-bold uppercase tracking-widest block">
            STAGE 05 / 06 — READINESS VERIFICATION
          </span>
          <h2 className="text-3xl font-extrabold font-mono text-hmi-text tracking-tight">
            MACHINE READY FOR OPERATION
          </h2>
          <p className="text-sm text-hmi-success font-mono mt-1">
            "All startup requirements have been successfully completed and verified."
          </p>
        </div>
      </div>

      {/* Summary Cards Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Machine Checks Card */}
        <div className="rounded-xl border border-hmi-border bg-hmi-card p-5 space-y-3 shadow-hmi-card">
          <div className="flex items-center justify-between border-b border-hmi-border pb-2">
            <div className="flex items-center space-x-2 text-hmi-success">
              <ShieldCheck className="h-5 w-5" />
              <span className="font-mono text-sm font-bold">MACHINE CHECKS</span>
            </div>
            <CheckCircle2 className="h-5 w-5 text-hmi-success" />
          </div>
          <div className="font-mono text-xs space-y-1">
            <span className="text-hmi-text-dim block">Status:</span>
            <span className="text-hmi-success font-bold text-sm block">
              ✓ {stats.checksConfirmedCount}/{stats.checksTotalCount} Checks Confirmed
            </span>
            <p className="text-[11px] text-hmi-text-muted">
              E-stop, safety guards, lube, coolant & zero reference verified.
            </p>
          </div>
        </div>

        {/* Tools Setup Card */}
        <div className="rounded-xl border border-hmi-border bg-hmi-card p-5 space-y-3 shadow-hmi-card">
          <div className="flex items-center justify-between border-b border-hmi-border pb-2">
            <div className="flex items-center space-x-2 text-hmi-success">
              <Wrench className="h-5 w-5" />
              <span className="font-mono text-sm font-bold">CUTTING TOOLS</span>
            </div>
            <CheckCircle2 className="h-5 w-5 text-hmi-success" />
          </div>
          <div className="font-mono text-xs space-y-1">
            <span className="text-hmi-text-dim block">Status:</span>
            <span className="text-hmi-success font-bold text-sm block">
              ✓ {stats.toolsConfirmedCount}/{stats.toolsTotalCount} Tools Seated
            </span>
            <p className="text-[11px] text-hmi-text-muted">
              T01 Face Mill, T02 Rough Mill, T03 Finish Mill & T04 Drill loaded.
            </p>
          </div>
        </div>

        {/* Workpiece Setup Card */}
        <div className="rounded-xl border border-hmi-border bg-hmi-card p-5 space-y-3 shadow-hmi-card">
          <div className="flex items-center justify-between border-b border-hmi-border pb-2">
            <div className="flex items-center space-x-2 text-hmi-success">
              <Box className="h-5 w-5" />
              <span className="font-mono text-sm font-bold">WORKPIECE SETUP</span>
            </div>
            <CheckCircle2 className="h-5 w-5 text-hmi-success" />
          </div>
          <div className="font-mono text-xs space-y-1">
            <span className="text-hmi-text-dim block">Status:</span>
            <span className="text-hmi-success font-bold text-sm block">
              ✓ {stats.workpieceConfirmedCount}/{stats.workpieceTotalCount} Steps Verified
            </span>
            <p className="text-[11px] text-hmi-text-muted">
              Precision vise clamped at 45 Nm with G54 work offset zero set.
            </p>
          </div>
        </div>
      </div>

      {/* Program & Specification Breakdown */}
      <div className="rounded-xl border border-hmi-border bg-hmi-panel p-5 space-y-4">
        <div className="flex items-center space-x-2 text-hmi-primary font-mono text-xs font-bold uppercase">
          <FileCode className="h-4 w-4" />
          <span>PRODUCTION EXECUTION SPECIFICATION</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-hmi-card p-3 rounded border border-hmi-border">
            <span className="text-hmi-text-dim block">CNC PROGRAM</span>
            <span className="text-hmi-primary font-bold text-sm">
              {scenario.cncProgram} ({scenario.cncRevision})
            </span>
          </div>

          <div className="bg-hmi-card p-3 rounded border border-hmi-border">
            <span className="text-hmi-text-dim block">WORK OFFSET</span>
            <span className="text-hmi-success font-bold text-sm">{scenario.workOffset}</span>
          </div>

          <div className="bg-hmi-card p-3 rounded border border-hmi-border">
            <span className="text-hmi-text-dim block">DRAWING</span>
            <span className="text-hmi-text font-bold text-sm">
              {scenario.partNumber} ({scenario.drawingRevision})
            </span>
          </div>

          <div className="bg-hmi-card p-3 rounded border border-hmi-border">
            <span className="text-hmi-text-dim block">MATERIAL</span>
            <span className="text-hmi-text font-bold text-sm">{scenario.material}</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={() => goToStage("OPERATION")}
          disabled={!isFullyPrepared || isActionLoading}
          className="flex items-center space-x-3 rounded-xl bg-hmi-success hover:bg-emerald-600 min-h-[56px] px-8 text-lg font-bold text-hmi-bg font-mono shadow-hmi-glow-green transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>PROCEED TO OPERATION</span>
          <ArrowRight className="h-6 w-6 stroke-[3]" />
        </button>
      </div>
    </motion.div>
  );
};
