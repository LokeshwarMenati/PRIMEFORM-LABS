export type Stage =
  | "POWER_ON"
  | "MACHINE_CHECKS"
  | "TOOLS"
  | "WORKPIECE"
  | "READY"
  | "OPERATION";

export type OperationStatus = "READY" | "RUNNING" | "STOPPED";

export interface MachineData {
  id: string;
  name: string;
  machineCode: string;
  powerStatus: string;
  safetyStatus: string;
  controlStatus: string;
  connectionStatus: string;
  updatedAt: string;
}

export interface ScenarioData {
  id: string;
  partName: string;
  partNumber: string;
  quantity: number;
  material: string;
  drawingRevision: string;
  cncProgram: string;
  cncRevision: string;
  fixture: string;
  workOffset: string;
  operationId: string;
  operationName: string;
}

export interface MachineCheckItem {
  id: string;
  code: string;
  title: string;
  instruction: string;
  order: number;
  confirmed: boolean;
  confirmedAt?: string | null;
  confirmedBy?: string | null;
}

export interface ToolCheckItem {
  id: string;
  toolNumber: string;
  toolType: string;
  purpose: string;
  cncProgram: string;
  cncRevision: string;
  order: number;
  confirmed: boolean;
  confirmedAt?: string | null;
  confirmedBy?: string | null;
}

export interface WorkpieceCheckItem {
  id: string;
  stepName: string;
  instruction: string;
  fixtureDetails: string;
  workOffsetDetails: string;
  orientationDetails: string;
  materialDetails: string;
  drawingDetails: string;
  order: number;
  confirmed: boolean;
  confirmedAt?: string | null;
  confirmedBy?: string | null;
}

export interface WorkflowStateData {
  id: string;
  scenarioId: string;
  currentStage: Stage;
  currentItemIndex: number;
  operationStatus: OperationStatus;
  simulatedProgress: number;
  elapsedSeconds: number;
  operatorName: string;
  lastAuditNote?: string | null;
  updatedAt: string;
}

export interface FullHmiState {
  machine: MachineData;
  scenario: ScenarioData;
  checks: MachineCheckItem[];
  tools: ToolCheckItem[];
  workpieceChecks: WorkpieceCheckItem[];
  workflow: WorkflowStateData;
  stats: {
    checksConfirmedCount: number;
    checksTotalCount: number;
    toolsConfirmedCount: number;
    toolsTotalCount: number;
    workpieceConfirmedCount: number;
    workpieceTotalCount: number;
    isFullyPrepared: boolean;
  };
}

export interface SimulationStep {
  phase: string;
  toolNumber: string;
  toolType: string;
  minProgress: number;
  maxProgress: number;
  description: string;
}
