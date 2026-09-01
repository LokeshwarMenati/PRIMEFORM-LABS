"use client";

import React, { useState } from "react";
import { useHmiStore } from "@/lib/store/hmi-store";
import { FilePlus, Check, X, Layers, FileCode, Wrench, Sparkles } from "lucide-react";

export const CustomScenarioModal: React.FC = () => {
  const {
    isCustomInputModalOpen,
    setCustomInputModalOpen,
    submitCustomScenario,
    isActionLoading,
  } = useHmiStore();

  const [partName, setPartName] = useState("Titanium Turbine Flange");
  const [partNumber, setPartNumber] = useState("PF-TF-909");
  const [material, setMaterial] = useState("Titanium Ti-6Al-4V");
  const [cncProgram, setCncProgram] = useState("O2002");
  const [cncRevision, setCncRevision] = useState("Rev 01");
  const [workOffset, setWorkOffset] = useState("G55");
  const [fixture, setFixture] = useState("Dual-Station Machining Vise, Ground Parallels");

  if (!isCustomInputModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitCustomScenario({
      partName,
      partNumber,
      material,
      cncProgram,
      cncRevision,
      workOffset,
      fixture,
    });
  };

  const handlePresetSelect = (preset: string) => {
    if (preset === "turbine") {
      setPartName("Titanium Turbine Flange");
      setPartNumber("PF-TF-909");
      setMaterial("Titanium Ti-6Al-4V");
      setCncProgram("O2002");
      setCncRevision("Rev 01");
      setWorkOffset("G55");
      setFixture("Dual-Station Machining Vise, Ground Parallels");
    } else if (preset === "housing") {
      setPartName("VMC Housing Plate");
      setPartNumber("PF-VM-001");
      setMaterial("Aluminium 6061-T6");
      setCncProgram("O1001");
      setCncRevision("Rev 03");
      setWorkOffset("G54");
      setFixture("Precision machine vise, Fixed parallels");
    } else if (preset === "gear") {
      setPartName("High-Precision Steel Gear Cover");
      setPartNumber("PF-GC-404");
      setMaterial("Stainless Steel 316L");
      setCncProgram("O3003");
      setCncRevision("Rev 02");
      setWorkOffset("G56");
      setFixture("Soft Jaw Vise, Fixture Plate");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-xl border border-hmi-border bg-hmi-panel p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-hmi-border pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-hmi-primary/10 border border-hmi-primary/30 text-hmi-primary">
              <FilePlus className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-hmi-text font-mono">
                CREATE CUSTOM WORK ORDER (INPUT GENERATOR)
              </h3>
              <p className="text-xs text-hmi-text-dim">
                Submit custom part specs, CNC programs, and work offsets to test HMI generation.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCustomInputModalOpen(false)}
            className="text-hmi-text-dim hover:text-hmi-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Presets Bar */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-hmi-text-dim">Quick Presets:</span>
          <button
            type="button"
            onClick={() => handlePresetSelect("housing")}
            className="px-2.5 py-1 rounded bg-hmi-card border border-hmi-border hover:border-hmi-primary text-hmi-text"
          >
            Aluminium Housing (PF-VM-001)
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect("turbine")}
            className="px-2.5 py-1 rounded bg-hmi-card border border-hmi-border hover:border-hmi-primary text-hmi-primary font-bold"
          >
            Titanium Flange (PF-TF-909)
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect("gear")}
            className="px-2.5 py-1 rounded bg-hmi-card border border-hmi-border hover:border-hmi-primary text-hmi-success"
          >
            Steel Gear (PF-GC-404)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-hmi-text-muted mb-1 uppercase">Part Name</label>
              <input
                type="text"
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                className="w-full rounded border border-hmi-border bg-hmi-card px-3 py-2 text-hmi-text focus:border-hmi-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-hmi-text-muted mb-1 uppercase">Part Number / ID</label>
              <input
                type="text"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                className="w-full rounded border border-hmi-border bg-hmi-card px-3 py-2 text-hmi-text focus:border-hmi-primary focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-hmi-text-muted mb-1 uppercase">Raw Material</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full rounded border border-hmi-border bg-hmi-card px-3 py-2 text-hmi-text focus:border-hmi-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-hmi-text-muted mb-1 uppercase">Work Offset (Datum)</label>
              <input
                type="text"
                value={workOffset}
                onChange={(e) => setWorkOffset(e.target.value)}
                className="w-full rounded border border-hmi-border bg-hmi-card px-3 py-2 text-hmi-success font-bold focus:border-hmi-primary focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-hmi-text-muted mb-1 uppercase">CNC Program Code</label>
              <input
                type="text"
                value={cncProgram}
                onChange={(e) => setCncProgram(e.target.value)}
                className="w-full rounded border border-hmi-border bg-hmi-card px-3 py-2 text-hmi-primary font-bold focus:border-hmi-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-hmi-text-muted mb-1 uppercase">CNC Revision</label>
              <input
                type="text"
                value={cncRevision}
                onChange={(e) => setCncRevision(e.target.value)}
                className="w-full rounded border border-hmi-border bg-hmi-card px-3 py-2 text-hmi-text focus:border-hmi-primary focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-hmi-text-muted mb-1 uppercase">Workholding Fixture</label>
            <input
              type="text"
              value={fixture}
              onChange={(e) => setFixture(e.target.value)}
              className="w-full rounded border border-hmi-border bg-hmi-card px-3 py-2 text-hmi-text focus:border-hmi-primary focus:outline-none"
              required
            />
          </div>

          <div className="pt-3 border-t border-hmi-border flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setCustomInputModalOpen(false)}
              className="px-4 py-2 rounded bg-hmi-card border border-hmi-border text-hmi-text-dim hover:text-hmi-text"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isActionLoading}
              className="flex items-center space-x-2 rounded bg-hmi-primary hover:bg-hmi-primary-hover px-5 py-2 text-sm font-bold text-hmi-bg font-mono shadow-hmi-glow-cyan"
            >
              <Sparkles className="h-4 w-4" />
              <span>SUBMIT & LOAD CUSTOM HMI JOB</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
