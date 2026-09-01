"use client";

import React from "react";
import { useHmiStore } from "@/lib/store/hmi-store";
import { Wrench, CheckCircle2, OctagonAlert, ArrowRight, Check, Disc, FileCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ToolsStage: React.FC = () => {
  const {
    hmiState,
    confirmToolCheck,
    goToStage,
    isActionLoading,
  } = useHmiStore();

  if (!hmiState) return null;

  const { tools, stats, scenario, workflow } = hmiState;

  const activeToolIndex = Math.min(workflow.currentItemIndex, tools.length - 1);
  const currentTool = tools[activeToolIndex] || tools[0];

  const allToolsConfirmed = stats.toolsConfirmedCount === stats.toolsTotalCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Stage Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-hmi-card p-4 rounded-xl border border-hmi-border shadow-hmi-card">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-hmi-primary/10 border border-hmi-primary/30 text-hmi-primary">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-hmi-text-dim uppercase tracking-wider block">
              STAGE 03 / 06 — CUTTING TOOL LOADING
            </span>
            <h2 className="text-xl font-bold font-mono text-hmi-text">
              REQUIRED TOOLS SETUP
            </h2>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-4 bg-hmi-panel px-4 py-2 rounded-lg border border-hmi-border">
          <div className="text-right font-mono">
            <span className="text-[10px] text-hmi-text-dim block">TOOLS INSTALLED</span>
            <span className="text-sm font-bold text-hmi-success">
              {stats.toolsConfirmedCount} / {stats.toolsTotalCount} READY
            </span>
          </div>
          <div className="w-24 bg-hmi-border h-2 rounded-full overflow-hidden">
            <div
              className="bg-hmi-success h-full transition-all duration-500"
              style={{
                width: `${(stats.toolsConfirmedCount / stats.toolsTotalCount) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Grid Layout: Tool Selector Carousel & Main Focus Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Tool Selection List */}
        <div className="md:col-span-1 space-y-2">
          <h3 className="text-xs font-mono text-hmi-text-dim uppercase tracking-wider mb-2 px-1">
            SPINDLE TOOL POCKETS
          </h3>

          {tools.map((t, idx) => {
            const isActive = idx === activeToolIndex;
            return (
              <button
                key={t.id}
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
                    : t.confirmed
                    ? "border-hmi-success/30 bg-hmi-panel text-hmi-text-muted"
                    : "border-hmi-border bg-hmi-card text-hmi-text-dim"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-bold text-hmi-primary px-1.5 py-0.5 rounded bg-hmi-border">
                    {t.toolNumber}
                  </span>
                  <div className="truncate max-w-[120px]">
                    <span className="text-xs font-bold block">{t.toolType}</span>
                    <span className="text-[10px] text-hmi-text-dim block">{t.purpose}</span>
                  </div>
                </div>

                {t.confirmed ? (
                  <CheckCircle2 className="h-4 w-4 text-hmi-success flex-shrink-0" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-amber-400 flex-shrink-0 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Active Tool Detail Card */}
        <div className="md:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTool.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="rounded-xl border border-hmi-border bg-hmi-card p-6 shadow-hmi-card space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-hmi-border pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold font-mono text-hmi-primary px-2.5 py-0.5 rounded bg-hmi-primary/20 border border-hmi-primary/30">
                    {currentTool.toolNumber}
                  </span>
                  <span className="text-xs font-mono text-hmi-text-dim uppercase">
                    TOOL {activeToolIndex + 1} OF {tools.length}
                  </span>
                </div>

                <div
                  className={`px-3 py-1 rounded font-mono text-xs font-bold flex items-center space-x-1.5 ${
                    currentTool.confirmed
                      ? "bg-hmi-success/10 text-hmi-success border border-hmi-success/30"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {currentTool.confirmed ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>INSTALLED & VERIFIED</span>
                    </>
                  ) : (
                    <>
                      <OctagonAlert className="h-3.5 w-3.5" />
                      <span>INSERTION REQUIRED</span>
                    </>
                  )}
                </div>
              </div>

              {/* Tool Focus Display */}
              <div
                className={`rounded-xl border p-6 transition-all ${
                  currentTool.confirmed
                    ? "border-hmi-success/40 bg-hmi-success/5"
                    : "border-hmi-primary/40 bg-hmi-primary/5 shadow-hmi-glow-cyan"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl border flex-shrink-0 ${
                      currentTool.confirmed
                        ? "bg-hmi-success/20 border-hmi-success text-hmi-success shadow-hmi-glow-green"
                        : "bg-hmi-primary/20 border-hmi-primary text-hmi-primary animate-pulse"
                    }`}
                  >
                    <Disc className="h-7 w-7" />
                  </div>

                  <div className="space-y-2 flex-1">
                    <div>
                      <span className="text-xs font-mono text-hmi-text-dim block uppercase">
                        TOOL SPECIFICATION
                      </span>
                      <h3 className="text-xl font-bold font-mono text-hmi-text">
                        {currentTool.toolType}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-hmi-border/60 text-xs font-mono">
                      <div>
                        <span className="text-hmi-text-dim block">Machining Purpose:</span>
                        <span className="text-hmi-text font-bold">{currentTool.purpose}</span>
                      </div>
                      <div>
                        <span className="text-hmi-text-dim block">CNC Program Ref:</span>
                        <span className="text-hmi-primary font-bold">
                          {scenario.cncProgram} ({scenario.cncRevision})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {currentTool.confirmed && currentTool.confirmedBy && (
                  <div className="mt-4 pt-3 border-t border-hmi-success/20 text-xs font-mono text-hmi-success">
                    Verified & Locked by <span className="font-bold">{currentTool.confirmedBy}</span> at{" "}
                    {currentTool.confirmedAt
                      ? new Date(currentTool.confirmedAt).toLocaleTimeString("en-US", { hour12: false })
                      : "recently"}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div>
                {!currentTool.confirmed ? (
                  <button
                    onClick={() => confirmToolCheck(currentTool.id)}
                    disabled={isActionLoading}
                    className="w-full flex items-center justify-center space-x-2 rounded-xl bg-hmi-success hover:bg-emerald-600 min-h-[52px] text-base font-bold text-hmi-bg font-mono shadow-hmi-glow-green transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Check className="h-5 w-5 stroke-[3]" />
                    <span>CONFIRM TOOL INSERTION ({currentTool.toolNumber})</span>
                  </button>
                ) : (
                  <div className="w-full text-center py-3 bg-hmi-panel rounded-xl border border-hmi-border text-xs font-mono text-hmi-text-muted">
                    ✓ Tool {currentTool.toolNumber} confirmed seated in spindle holder.
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Stage Progression Bar */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-hmi-text-dim">
              {!allToolsConfirmed
                ? `Confirm all ${stats.toolsTotalCount} tools to proceed to Workpiece Setup.`
                : "All required tools verified and loaded."}
            </span>

            <button
              onClick={() => goToStage("WORKPIECE")}
              disabled={!allToolsConfirmed || isActionLoading}
              className={`flex items-center space-x-2 rounded-xl px-6 py-3 font-mono text-sm font-bold transition-all ${
                allToolsConfirmed
                  ? "bg-hmi-primary hover:bg-hmi-primary-hover text-hmi-bg shadow-hmi-glow-cyan cursor-pointer"
                  : "bg-hmi-border/40 text-hmi-text-dim cursor-not-allowed border border-hmi-border/50"
              }`}
            >
              <span>NEXT: WORKPIECE SETUP</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
