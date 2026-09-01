"use client";

import React, { useEffect } from "react";
import { useHmiStore } from "@/lib/store/hmi-store";
import { HmiHeader } from "./HmiHeader";
import { WorkflowStepper } from "./WorkflowStepper";
import { MachineStatusStrip } from "./MachineStatusStrip";
import { OperatorAuthModal } from "./OperatorAuthModal";
import { CustomScenarioModal } from "./CustomScenarioModal";
import { HowItWorksModal } from "./HowItWorksModal";
import { Toast } from "@/components/ui/Toast";

import { PowerOnStage } from "./stages/PowerOnStage";
import { MachineChecksStage } from "./stages/MachineChecksStage";
import { ToolsStage } from "./stages/ToolsStage";
import { WorkpieceStage } from "./stages/WorkpieceStage";
import { ReadyReviewStage } from "./stages/ReadyReviewStage";
import { OperationStage } from "./stages/OperationStage";

import { AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCw, Command } from "lucide-react";

export const HmiShell: React.FC = () => {
  const {
    hmiState,
    isLoading,
    error,
    fetchState,
    confirmMachineCheck,
    confirmToolCheck,
    confirmWorkpieceCheck,
    startOperation,
    stopOperation,
    goToStage,
  } = useHmiStore();

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;

      if (!hmiState) return;

      const currentStage = hmiState.workflow.currentStage;
      const operationStatus = hmiState.workflow.operationStatus;

      // Emergency Stop: ESCAPE or 'S' key
      if (e.key === "Escape" || e.key.toLowerCase() === "s") {
        if (operationStatus === "RUNNING") {
          e.preventDefault();
          stopOperation("Keyboard E-stop trigger");
        }
      }

      // Space / Enter: Confirm current item
      if (e.key === "Enter" || e.code === "Space") {
        if (currentStage === "MACHINE_CHECKS") {
          const check = hmiState.checks[hmiState.workflow.currentItemIndex];
          if (check && !check.confirmed) {
            e.preventDefault();
            confirmMachineCheck(check.id);
          }
        } else if (currentStage === "TOOLS") {
          const tool = hmiState.tools[hmiState.workflow.currentItemIndex];
          if (tool && !tool.confirmed) {
            e.preventDefault();
            confirmToolCheck(tool.id);
          }
        } else if (currentStage === "WORKPIECE") {
          const wp = hmiState.workpieceChecks[hmiState.workflow.currentItemIndex];
          if (wp && !wp.confirmed) {
            e.preventDefault();
            confirmWorkpieceCheck(wp.id);
          }
        } else if (currentStage === "READY") {
          e.preventDefault();
          goToStage("OPERATION");
        } else if (currentStage === "OPERATION") {
          if (operationStatus !== "RUNNING") {
            e.preventDefault();
            startOperation();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    hmiState,
    confirmMachineCheck,
    confirmToolCheck,
    confirmWorkpieceCheck,
    startOperation,
    stopOperation,
    goToStage,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-hmi-bg flex flex-col items-center justify-center p-4 font-mono text-hmi-text">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-4 border-hmi-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm tracking-widest text-hmi-text-dim uppercase">
            LOADING PRIMEFORM HMI WORKSTATION DATA...
          </p>
        </div>
      </div>
    );
  }

  if (error || !hmiState) {
    return (
      <div className="min-h-screen bg-hmi-bg flex flex-col items-center justify-center p-4 font-mono text-hmi-text">
        <div className="max-w-md w-full rounded-xl border border-hmi-danger/40 bg-hmi-panel p-6 shadow-2xl space-y-4 text-center">
          <div className="flex justify-center text-hmi-danger">
            <AlertCircle className="h-12 w-12" />
          </div>
          <h2 className="text-xl font-bold">HMI SERVICE ERROR</h2>
          <p className="text-xs text-hmi-text-dim">{error || "Failed to initialize workflow context"}</p>
          <button
            onClick={() => fetchState()}
            className="w-full flex items-center justify-center space-x-2 rounded-lg bg-hmi-primary hover:bg-hmi-primary-hover py-2.5 text-sm font-bold text-hmi-bg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>RETRY CONNECTION</span>
          </button>
        </div>
      </div>
    );
  }

  const renderCurrentStage = () => {
    switch (hmiState.workflow.currentStage) {
      case "POWER_ON":
        return <PowerOnStage />;
      case "MACHINE_CHECKS":
        return <MachineChecksStage />;
      case "TOOLS":
        return <ToolsStage />;
      case "WORKPIECE":
        return <WorkpieceStage />;
      case "READY":
        return <ReadyReviewStage />;
      case "OPERATION":
        return <OperationStage />;
      default:
        return <PowerOnStage />;
    }
  };

  return (
    <div className="min-h-screen bg-hmi-bg text-hmi-text flex flex-col font-sans selection:bg-hmi-primary selection:text-hmi-bg">
      {/* Top Header */}
      <HmiHeader />

      {/* Stepper Workflow Nav */}
      <WorkflowStepper />

      {/* Machine Status Telemetry Strip */}
      <MachineStatusStrip />

      {/* Main HMI Stage Container */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <AnimatePresence mode="wait">{renderCurrentStage()}</AnimatePresence>
      </main>

      {/* Bottom Footer Shortcuts Info */}
      <footer className="bg-hmi-panel border-t border-hmi-border px-4 py-2 text-[11px] font-mono text-hmi-text-dim flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <Command className="h-3 w-3 text-hmi-primary" />
            <span>HMI QUICKKEYS:</span>
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-hmi-card border border-hmi-border text-hmi-text">
              ENTER
            </kbd>{" "}
            /{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-hmi-card border border-hmi-border text-hmi-text">
              SPACE
            </kbd>{" "}
            Confirm Check
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-hmi-card border border-hmi-border text-hmi-text">
              ESC
            </kbd>{" "}
            /{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-hmi-card border border-hmi-border text-hmi-text">
              S
            </kbd>{" "}
            Emergency Stop
          </span>
        </div>

        <div>
          Primeform Labs VMC HMI — Software Simulation Platform
        </div>
      </footer>

      {/* Operator Session Modal */}
      <OperatorAuthModal />

      {/* Custom Scenario Input Modal */}
      <CustomScenarioModal />

      {/* How It Works Demo Modal */}
      <HowItWorksModal />

      {/* Notification Toast */}
      <Toast />
    </div>
  );
};
