"use client";

import React from "react";
import { useHmiStore } from "@/lib/store/hmi-store";
import { Stage } from "@/lib/types";
import { STAGE_ORDER, STAGE_LABELS } from "@/lib/constants";
import { CheckCircle2, Lock, Power, ShieldCheck, Wrench, Box, Sparkles, Play } from "lucide-react";
import { motion } from "framer-motion";

export const WorkflowStepper: React.FC = () => {
  const { hmiState, goToStage, isActionLoading } = useHmiStore();

  if (!hmiState) return null;

  const currentStage = hmiState.workflow.currentStage;
  const currentStageIndex = STAGE_ORDER.indexOf(currentStage);

  const getStageIcon = (stage: Stage) => {
    switch (stage) {
      case "POWER_ON":
        return <Power className="h-4 w-4" />;
      case "MACHINE_CHECKS":
        return <ShieldCheck className="h-4 w-4" />;
      case "TOOLS":
        return <Wrench className="h-4 w-4" />;
      case "WORKPIECE":
        return <Box className="h-4 w-4" />;
      case "READY":
        return <Sparkles className="h-4 w-4" />;
      case "OPERATION":
        return <Play className="h-4 w-4" />;
    }
  };

  const isStageCompleted = (index: number) => index < currentStageIndex;
  const isStageActive = (index: number) => index === currentStageIndex;
  const isStageLocked = (index: number) => index > currentStageIndex;

  return (
    <nav className="w-full bg-hmi-bg px-4 py-3 border-b border-hmi-border select-none">
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        {STAGE_ORDER.map((stage, idx) => {
          const completed = isStageCompleted(idx);
          const active = isStageActive(idx);
          const locked = isStageLocked(idx);

          return (
            <React.Fragment key={stage}>
              {/* Stepper Node */}
              <button
                onClick={() => {
                  if (!locked && !isActionLoading && stage !== currentStage) {
                    goToStage(stage);
                  }
                }}
                disabled={locked || isActionLoading}
                className={`group relative flex flex-1 items-center justify-between min-w-[140px] px-3 py-2.5 rounded-lg border text-left transition-all ${
                  active
                    ? "border-hmi-primary bg-hmi-primary/10 shadow-hmi-glow-cyan text-hmi-text"
                    : completed
                    ? "border-hmi-success/40 bg-hmi-success/5 hover:border-hmi-success text-hmi-text"
                    : "border-hmi-border/60 bg-hmi-panel/50 opacity-60 cursor-not-allowed text-hmi-text-dim"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-mono font-bold transition-colors ${
                      active
                        ? "bg-hmi-primary text-hmi-bg"
                        : completed
                        ? "bg-hmi-success/20 text-hmi-success border border-hmi-success/40"
                        : "bg-hmi-border/50 text-hmi-text-dim"
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2 className="h-4 w-4 text-hmi-success" />
                    ) : locked ? (
                      <Lock className="h-3.5 w-3.5 text-hmi-text-dim" />
                    ) : (
                      getStageIcon(stage)
                    )}
                  </div>

                  <div>
                    <span className="block text-[10px] font-mono tracking-wider uppercase text-hmi-text-dim">
                      STAGE 0{idx + 1}
                    </span>
                    <span
                      className={`block text-xs font-bold font-mono tracking-tight ${
                        active
                          ? "text-hmi-primary"
                          : completed
                          ? "text-hmi-success"
                          : "text-hmi-text-dim"
                      }`}
                    >
                      {STAGE_LABELS[stage]}
                    </span>
                  </div>
                </div>

                {/* Active Indicator Pulse */}
                {active && (
                  <motion.div
                    layoutId="activeStageGlow"
                    className="absolute inset-0 rounded-lg border-2 border-hmi-primary pointer-events-none"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
              </button>

              {/* Connecting Arrow */}
              {idx < STAGE_ORDER.length - 1 && (
                <div className="text-hmi-border text-sm font-bold select-none px-0.5">
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
