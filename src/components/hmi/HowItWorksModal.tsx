"use client";

import React, { useState } from "react";
import { useHmiStore } from "@/lib/store/hmi-store";
import { PlayCircle, ShieldCheck, Database, Cpu, CheckCircle2, ArrowRight, X, Play, RefreshCw } from "lucide-react";

export const HowItWorksModal: React.FC = () => {
  const {
    isHowItWorksModalOpen,
    setHowItWorksModalOpen,
    resetWorkflow,
    confirmMachineCheck,
    confirmToolCheck,
    confirmWorkpieceCheck,
    goToStage,
    startOperation,
    showToast,
    hmiState,
  } = useHmiStore();

  const [isAutoDemoRunning, setIsAutoDemoRunning] = useState(false);

  if (!isHowItWorksModalOpen) return null;

  const handleRunAutomatedDemo = async () => {
    setIsAutoDemoRunning(true);
    setHowItWorksModalOpen(false);
    showToast("info", "Starting Automated Interactive Demonstration...");

    try {
      await resetWorkflow();
      await new Promise((r) => setTimeout(r, 800));

      await goToStage("MACHINE_CHECKS");
      await new Promise((r) => setTimeout(r, 600));

      const state = useHmiStore.getState().hmiState;
      if (state) {
        for (const check of state.checks) {
          await confirmMachineCheck(check.id);
          await new Promise((r) => setTimeout(r, 400));
        }
      }

      await goToStage("TOOLS");
      await new Promise((r) => setTimeout(r, 600));

      const stateTools = useHmiStore.getState().hmiState;
      if (stateTools) {
        for (const tool of stateTools.tools) {
          await confirmToolCheck(tool.id);
          await new Promise((r) => setTimeout(r, 400));
        }
      }

      await goToStage("WORKPIECE");
      await new Promise((r) => setTimeout(r, 600));

      const stateWp = useHmiStore.getState().hmiState;
      if (stateWp) {
        for (const wp of stateWp.workpieceChecks) {
          await confirmWorkpieceCheck(wp.id);
          await new Promise((r) => setTimeout(r, 400));
        }
      }

      await goToStage("READY");
      await new Promise((r) => setTimeout(r, 800));

      await goToStage("OPERATION");
      await new Promise((r) => setTimeout(r, 600));

      await startOperation();
      showToast("success", "Automated Demo complete — Machining simulation running!");
    } catch (err) {
      showToast("error", "Automated demo execution error");
    } finally {
      setIsAutoDemoRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-2xl rounded-xl border border-hmi-border bg-hmi-panel p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hmi-border pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-hmi-primary/10 border border-hmi-primary/30 text-hmi-primary">
              <PlayCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-hmi-text font-mono">
                HOW IT WORKS — RECRUITER & DEMO GUIDE
              </h3>
              <p className="text-xs text-hmi-text-dim">
                Architecture, Data Flow, and Automated Interactive Walkthrough
              </p>
            </div>
          </div>
          <button
            onClick={() => setHowItWorksModalOpen(false)}
            className="text-hmi-text-dim hover:text-hmi-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dataflow Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="rounded-lg border border-hmi-border bg-hmi-card p-3 space-y-1">
            <span className="text-hmi-primary font-bold block flex items-center space-x-1">
              <Cpu className="h-4 w-4" />
              <span>1. OPERATOR INPUT</span>
            </span>
            <p className="text-hmi-text-muted text-[11px] leading-relaxed">
              Operator inputs safety confirmations, tool loadings, and vise clamping checks via touch interface.
            </p>
          </div>

          <div className="rounded-lg border border-hmi-border bg-hmi-card p-3 space-y-1">
            <span className="text-hmi-success font-bold block flex items-center space-x-1">
              <ShieldCheck className="h-4 w-4" />
              <span>2. STATE ENGINE</span>
            </span>
            <p className="text-hmi-text-muted text-[11px] leading-relaxed">
              Finite State Machine validates boundary rules to block operation until 100% of prerequisites pass.
            </p>
          </div>

          <div className="rounded-lg border border-hmi-border bg-hmi-card p-3 space-y-1">
            <span className="text-hmi-accent font-bold block flex items-center space-x-1">
              <Database className="h-4 w-4" />
              <span>3. DB & SIMULATION</span>
            </span>
            <p className="text-hmi-text-muted text-[11px] leading-relaxed">
              State is persisted in SQLite with audit logs. Simulation ticks progress (0–100%) and active tool phases.
            </p>
          </div>
        </div>

        {/* Video Simulation Box */}
        <div className="rounded-xl border border-hmi-primary/40 bg-hmi-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-hmi-border pb-2">
            <span className="text-xs font-mono text-hmi-primary font-bold uppercase tracking-wider flex items-center space-x-2">
              <Play className="h-4 w-4 fill-hmi-primary" />
              <span>INTERACTIVE DEMO SIMULATOR</span>
            </span>
            <span className="text-[10px] font-mono text-hmi-text-dim">Auto-Walkthrough</span>
          </div>

          <p className="text-xs text-hmi-text-muted font-sans leading-relaxed">
            Clicking the button below will run an **Automated Demo Sequence**. It will reset the state, sequentially confirm all 14 safety, tool, and workpiece checks, proceed to Ready Review, and launch the active machining simulation.
          </p>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleRunAutomatedDemo}
              disabled={isAutoDemoRunning}
              className="flex items-center space-x-2 rounded-lg bg-hmi-primary hover:bg-hmi-primary-hover px-5 py-2.5 text-xs font-bold text-hmi-bg font-mono shadow-hmi-glow-cyan transition-all"
            >
              <Play className="h-4 w-4 fill-hmi-bg" />
              <span>RUN AUTOMATED WORKFLOW DEMO</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs font-mono text-hmi-text-dim border-t border-hmi-border pt-3">
          <span>Primeform Labs VMC Operator HMI</span>
          <button
            onClick={() => setHowItWorksModalOpen(false)}
            className="hover:text-hmi-text"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
