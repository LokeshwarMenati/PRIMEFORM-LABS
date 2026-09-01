import { Stage, SimulationStep } from "./types";

export const STAGE_ORDER: Stage[] = [
  "POWER_ON",
  "MACHINE_CHECKS",
  "TOOLS",
  "WORKPIECE",
  "READY",
  "OPERATION",
];

export const STAGE_LABELS: Record<Stage, string> = {
  POWER_ON: "POWER ON",
  MACHINE_CHECKS: "MACHINE CHECKS",
  TOOLS: "REQUIRED TOOLS",
  WORKPIECE: "WORKPIECE SETUP",
  READY: "READY REVIEW",
  OPERATION: "OPERATION",
};

export const SIMULATION_PHASES: SimulationStep[] = [
  {
    phase: "FACE MILLING",
    toolNumber: "T01",
    toolType: "Ø50 mm Face Mill",
    minProgress: 0,
    maxProgress: 30,
    description: "Facing top surface of Aluminium 6061-T6 stock to Z0 datum",
  },
  {
    phase: "ROUGH POCKET MACHINING",
    toolNumber: "T02",
    toolType: "Ø10 mm Carbide End Mill",
    minProgress: 30,
    maxProgress: 65,
    description: "High-speed adaptive clearing of inner housing pocket",
  },
  {
    phase: "FINISH POCKET MACHINING",
    toolNumber: "T03",
    toolType: "Ø6 mm Carbide End Mill",
    minProgress: 65,
    maxProgress: 90,
    description: "Contour finishing pocket sidewalls and floor radius",
  },
  {
    phase: "DRILLING CYCLE",
    toolNumber: "T04",
    toolType: "Ø6 mm Drill",
    minProgress: 90,
    maxProgress: 100,
    description: "Peck drilling 4x perimeter mounting holes",
  },
];
