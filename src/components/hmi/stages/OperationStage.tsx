"use client";

import React, { useEffect, useRef, useState } from "react";
import { useHmiStore } from "@/lib/store/hmi-store";
import { SIMULATION_PHASES } from "@/lib/constants";
import { Play, Square, Pause, RotateCcw, CheckCircle2, Disc, Clock, ShieldAlert, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const OperationStage: React.FC = () => {
  const {
    hmiState,
    startOperation,
    stopOperation,
    updateSimulationProgress,
    goToStage,
    isActionLoading,
  } = useHmiStore();

  const [localProgress, setLocalProgress] = useState(0);
  const [localElapsed, setLocalElapsed] = useState(0);

  const isRunning = hmiState?.workflow.operationStatus === "RUNNING";
  const isStopped = hmiState?.workflow.operationStatus === "STOPPED";

  // Sync state on load
  useEffect(() => {
    if (hmiState?.workflow) {
      setLocalProgress(hmiState.workflow.simulatedProgress || 0);
      setLocalElapsed(hmiState.workflow.elapsedSeconds || 0);
    }
  }, [hmiState?.workflow.simulatedProgress, hmiState?.workflow.elapsedSeconds]);

  // Active ticker loop when RUNNING
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setLocalElapsed((prevTime) => {
          const nextTime = prevTime + 1;
          setLocalProgress((prevProg) => {
            if (prevProg >= 100) {
              if (timerRef.current) clearInterval(timerRef.current);
              updateSimulationProgress(100, nextTime);
              return 100;
            }
            const nextProg = Math.min(100, prevProg + 2.5); // ~40s full cycle
            updateSimulationProgress(nextProg, nextTime);
            return nextProg;
          });
          return nextTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, updateSimulationProgress]);

  if (!hmiState) return null;

  const { scenario } = hmiState;

  // Determine current active tool & machining phase
  const currentPhase =
    SIMULATION_PHASES.find(
      (p) => localProgress >= p.minProgress && localProgress < p.maxProgress
    ) || SIMULATION_PHASES[SIMULATION_PHASES.length - 1];

  const formattedElapsed = `${Math.floor(localElapsed / 60)
    .toString()
    .padStart(2, "0")}:${(localElapsed % 60).toString().padStart(2, "0")}`;

  const isCompleted = localProgress >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-4xl mx-auto space-y-6 select-none"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-hmi-card p-5 rounded-xl border border-hmi-border shadow-hmi-card">
        <div>
          <span className="text-[10px] font-mono text-hmi-text-dim uppercase tracking-wider block">
            STAGE 06 / 06 — AUTOMATED MACHINING EXECUTION
          </span>
          <h2 className="text-2xl font-bold font-mono text-hmi-text">
            {scenario.operationName}
          </h2>
          <p className="text-xs font-mono text-hmi-text-muted mt-0.5">
            Operation ID: {scenario.operationId} | Program: {scenario.cncProgram} ({scenario.cncRevision}) | Work Offset: {scenario.workOffset}
          </p>
        </div>

        {/* Status Badge */}
        <div
          className={`px-4 py-2 rounded-xl font-mono text-sm font-bold flex items-center space-x-2 border shadow-lg ${
            isRunning
              ? "bg-hmi-success/20 text-hmi-success border-hmi-success shadow-hmi-glow-green animate-pulse"
              : isCompleted
              ? "bg-hmi-primary/20 text-hmi-primary border-hmi-primary shadow-hmi-glow-cyan"
              : isStopped
              ? "bg-amber-500/20 text-amber-400 border-amber-500 shadow-hmi-glow-amber"
              : "bg-hmi-primary/20 text-hmi-primary border-hmi-primary"
          }`}
        >
          {isRunning ? (
            <>
              <Play className="h-4 w-4 text-hmi-success fill-hmi-success" />
              <span>RUNNING</span>
            </>
          ) : isCompleted ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-hmi-primary" />
              <span>CYCLE COMPLETE</span>
            </>
          ) : isStopped ? (
            <>
              <Pause className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span>STOPPED</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-hmi-primary" />
              <span>READY TO START</span>
            </>
          )}
        </div>
      </div>

      {/* Main Control Dashboard */}
      <div className="rounded-xl border border-hmi-border bg-hmi-card p-6 shadow-hmi-card space-y-6">
        {/* Simulation Telemetry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          {/* Active Phase Card */}
          <div className="md:col-span-2 rounded-xl border border-hmi-border bg-hmi-panel p-4 space-y-2">
            <span className="text-xs text-hmi-text-dim block uppercase">CURRENT MACHINING STEP</span>
            <div className="flex items-center space-x-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                  isRunning
                    ? "bg-hmi-success/20 border-hmi-success text-hmi-success animate-spin"
                    : "bg-hmi-border/50 text-hmi-text-dim"
                }`}
              >
                <Disc className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-bold text-hmi-primary">{currentPhase.phase}</h3>
                <p className="text-xs text-hmi-text-muted">
                  Tool: <span className="text-hmi-text font-bold">{currentPhase.toolNumber}</span> ({currentPhase.toolType})
                </p>
              </div>
            </div>
            <p className="text-[11px] text-hmi-text-dim italic pt-1 border-t border-hmi-border/40">
              "{currentPhase.description}"
            </p>
          </div>

          {/* Elapsed Timer Card */}
          <div className="rounded-xl border border-hmi-border bg-hmi-panel p-4 flex flex-col justify-between">
            <span className="text-xs text-hmi-text-dim block uppercase">ELAPSED TIME</span>
            <div className="flex items-center space-x-2 text-2xl font-bold text-hmi-text">
              <Clock className="h-6 w-6 text-hmi-primary" />
              <span>{formattedElapsed}</span>
            </div>
            <span className="text-[10px] text-hmi-text-dim">Realtime feed clock</span>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="space-y-2 font-mono">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-hmi-text-dim uppercase">SIMULATION CYCLE PROGRESS</span>
            <span className="text-hmi-primary">{Math.round(localProgress)}%</span>
          </div>
          <div className="w-full bg-hmi-panel h-5 rounded-lg border border-hmi-border overflow-hidden p-0.5 relative">
            <motion.div
              className={`h-full rounded-md transition-all duration-300 ${
                isCompleted
                  ? "bg-hmi-success shadow-hmi-glow-green"
                  : isRunning
                  ? "bg-hmi-primary shadow-hmi-glow-cyan"
                  : "bg-amber-500"
              }`}
              style={{ width: `${localProgress}%` }}
            />
          </div>
        </div>

        {/* Primary Controls */}
        <div className="pt-2 border-t border-hmi-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-hmi-text-dim">
            <ShieldAlert className="h-4 w-4 text-hmi-primary" />
            <span>State preservation active. Emergency stop overrides available.</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {!isRunning && !isCompleted && (
              <button
                onClick={() => startOperation()}
                disabled={isActionLoading}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-hmi-success hover:bg-emerald-600 min-h-[52px] px-8 text-base font-bold text-hmi-bg font-mono shadow-hmi-glow-green transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="h-5 w-5 fill-hmi-bg" />
                <span>{isStopped ? "RESUME OPERATION" : "START OPERATION"}</span>
              </button>
            )}

            {isRunning && (
              <button
                onClick={() => stopOperation("Operator Manual Stop")}
                disabled={isActionLoading}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-hmi-danger hover:bg-hmi-danger-hover min-h-[52px] px-8 text-base font-bold text-hmi-text font-mono shadow-hmi-glow-red transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Square className="h-5 w-5 fill-hmi-text" />
                <span>STOP OPERATION</span>
              </button>
            )}

            {isStopped && (
              <button
                onClick={() => goToStage("READY")}
                disabled={isActionLoading}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl border border-hmi-border bg-hmi-panel hover:bg-hmi-border min-h-[52px] px-6 text-xs font-mono font-bold text-hmi-text transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>RETURN TO READY REVIEW</span>
              </button>
            )}
          </div>
        </div>

        {/* Simulation Stopped Banner */}
        {isStopped && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs font-mono text-amber-400 text-center">
            Simulation stopped. Latest workflow state preserved (Elapsed: {formattedElapsed}, Progress: {Math.round(localProgress)}%).
          </div>
        )}

        {/* Simulation Complete Banner */}
        {isCompleted && (
          <div className="rounded-lg border border-hmi-success/40 bg-hmi-success/10 p-4 text-xs font-mono text-hmi-success text-center space-y-2">
            <span className="font-bold text-sm block">SIMULATION COMPLETE</span>
            <p className="text-hmi-text-muted">
              All machining passes (Facing, Rough Pocketing, Finish Pocketing, Drilling) completed successfully.
            </p>
            <div className="pt-2 flex justify-center">
              <button
                onClick={() => useHmiStore.getState().resetWorkflow()}
                className="px-4 py-2 rounded bg-hmi-success text-hmi-bg font-bold hover:bg-emerald-600 transition-colors"
              >
                RESET WORKFLOW DEMO
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
