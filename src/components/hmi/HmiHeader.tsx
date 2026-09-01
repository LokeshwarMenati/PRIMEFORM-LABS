"use client";

import React, { useState, useEffect } from "react";
import { useHmiStore } from "@/lib/store/hmi-store";
import { Cpu, ShieldAlert, UserCheck, Volume2, VolumeX, RotateCcw } from "lucide-react";

export const HmiHeader: React.FC = () => {
  const {
    hmiState,
    operatorName,
    setDemoAuthModalOpen,
    audioFeedbackEnabled,
    toggleAudioFeedback,
    resetWorkflow,
    isActionLoading,
  } = useHmiStore();

  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full border-b border-hmi-border bg-hmi-panel px-4 py-3 select-none">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-hmi-primary/30 bg-hmi-primary/10 text-hmi-primary shadow-hmi-glow-cyan">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-wider text-hmi-text text-base">
                PRIMEFORM LABS
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-hmi-border text-hmi-text-muted font-mono">
                v2.4
              </span>
            </div>
            <p className="text-xs text-hmi-text-dim uppercase tracking-widest font-mono">
              VMC Operator HMI — Machine Control Interface
            </p>
          </div>
        </div>

        {/* Center Machine Info & Simulation Badge */}
        <div className="flex items-center space-x-3 bg-hmi-card px-4 py-1.5 rounded-lg border border-hmi-border">
          <div className="text-right font-mono">
            <span className="text-xs text-hmi-text-dim block leading-tight">MACHINE ID</span>
            <span className="text-sm font-bold text-hmi-primary">
              {hmiState?.machine.machineCode || "VMC-01"}
            </span>
          </div>

          <div className="h-6 w-px bg-hmi-border mx-1" />

          {/* SIMULATION MODE BADGE */}
          <div className="flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded text-amber-400 font-mono text-xs font-bold shadow-hmi-glow-amber">
            <ShieldAlert className="h-4 w-4 text-amber-400 animate-pulse" />
            <span>SIMULATION MODE</span>
          </div>
        </div>

        {/* Right Telemetry & Operator Menu */}
        <div className="flex items-center space-x-4">
          {/* Connection status */}
          <div className="flex items-center space-x-2 text-xs font-mono text-hmi-success bg-hmi-success/10 px-2.5 py-1 rounded border border-hmi-success/30">
            <span className="h-2 w-2 rounded-full bg-hmi-success animate-ping" />
            <span>CONNECTED</span>
          </div>

          {/* Realtime Clock */}
          <div className="font-mono text-sm font-semibold tracking-widest text-hmi-text-muted bg-hmi-card px-3 py-1 rounded border border-hmi-border">
            {currentTime || "--:--:--"}
          </div>

          {/* Reset Demo Button */}
          <button
            onClick={() => resetWorkflow()}
            disabled={isActionLoading}
            title="Reset Workflow Demo"
            className="flex items-center space-x-1 px-2.5 py-1 rounded border border-hmi-border bg-hmi-card hover:bg-hmi-border text-hmi-text-muted hover:text-hmi-text text-xs transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo</span>
          </button>

          {/* Mute Audio Toggle */}
          <button
            onClick={toggleAudioFeedback}
            title={audioFeedbackEnabled ? "Audio feedback ON" : "Audio feedback OFF"}
            className="p-1.5 rounded border border-hmi-border bg-hmi-card hover:bg-hmi-border text-hmi-text-muted transition-colors"
          >
            {audioFeedbackEnabled ? (
              <Volume2 className="h-4 w-4 text-hmi-primary" />
            ) : (
              <VolumeX className="h-4 w-4 text-hmi-text-dim" />
            )}
          </button>

          {/* Operator Profile Button */}
          <button
            onClick={() => setDemoAuthModalOpen(true)}
            className="flex items-center space-x-2 bg-hmi-card border border-hmi-border hover:border-hmi-primary/50 px-3 py-1.5 rounded-lg text-xs font-mono text-hmi-text transition-all"
          >
            <UserCheck className="h-4 w-4 text-hmi-primary" />
            <span className="font-semibold">{operatorName}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
