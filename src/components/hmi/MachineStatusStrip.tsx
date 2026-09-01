"use client";

import React from "react";
import { useHmiStore } from "@/lib/store/hmi-store";
import { Power, ShieldCheck, Cpu, Droplets, Compass } from "lucide-react";

export const MachineStatusStrip: React.FC = () => {
  const { hmiState } = useHmiStore();
  if (!hmiState) return null;

  const { machine, stats, workflow } = hmiState;

  const formattedLastUpdated = workflow.updatedAt
    ? new Date(workflow.updatedAt).toLocaleTimeString("en-US", { hour12: false })
    : "--:--:--";

  return (
    <aside className="w-full bg-hmi-panel/80 border-b border-hmi-border px-4 py-2 text-xs font-mono select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Telemetry Pills */}
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-hmi-text-dim font-bold tracking-wider uppercase">MACHINE HEALTH</span>

          <div className="flex items-center space-x-1.5 bg-hmi-card px-2.5 py-1 rounded border border-hmi-border text-hmi-success">
            <Power className="h-3.5 w-3.5" />
            <span className="text-hmi-text-dim">POWER:</span>
            <span className="font-bold">{machine.powerStatus}</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-hmi-card px-2.5 py-1 rounded border border-hmi-border text-hmi-success">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="text-hmi-text-dim">SAFETY:</span>
            <span className="font-bold">{machine.safetyStatus}</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-hmi-card px-2.5 py-1 rounded border border-hmi-border text-hmi-primary">
            <Cpu className="h-3.5 w-3.5" />
            <span className="text-hmi-text-dim">CONTROL:</span>
            <span className="font-bold">{machine.controlStatus}</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-hmi-card px-2.5 py-1 rounded border border-hmi-border text-hmi-success">
            <Droplets className="h-3.5 w-3.5" />
            <span className="text-hmi-text-dim">COOLANT:</span>
            <span className="font-bold">READY (84%)</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-hmi-card px-2.5 py-1 rounded border border-hmi-border text-hmi-success">
            <Compass className="h-3.5 w-3.5" />
            <span className="text-hmi-text-dim">REFERENCE:</span>
            <span className="font-bold">RETURN OK</span>
          </div>
        </div>

        {/* Audit Note & Timestamp */}
        <div className="flex items-center space-x-3 text-hmi-text-dim">
          {workflow.lastAuditNote && (
            <span className="truncate max-w-[300px] text-[11px] text-hmi-text-muted italic">
              Audit: "{workflow.lastAuditNote}"
            </span>
          )}
          <div className="bg-hmi-card px-2 py-0.5 rounded border border-hmi-border text-[11px]">
            Updated: <span className="text-hmi-text font-bold">{formattedLastUpdated}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
