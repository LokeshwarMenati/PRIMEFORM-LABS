import { create } from "zustand";
import { FullHmiState, Stage } from "../types";

interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  text: string;
}

interface HmiStoreState {
  hmiState: FullHmiState | null;
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;
  toast: ToastMessage | null;
  operatorName: string;
  isDemoAuthModalOpen: boolean;
  isCustomInputModalOpen: boolean;
  isHowItWorksModalOpen: boolean;
  audioFeedbackEnabled: boolean;

  // Actions
  setOperatorName: (name: string) => void;
  setDemoAuthModalOpen: (open: boolean) => void;
  setCustomInputModalOpen: (open: boolean) => void;
  setHowItWorksModalOpen: (open: boolean) => void;
  toggleAudioFeedback: () => void;
  fetchState: () => Promise<void>;
  confirmMachineCheck: (checkId: string) => Promise<void>;
  confirmToolCheck: (toolId: string) => Promise<void>;
  confirmWorkpieceCheck: (workpieceCheckId: string) => Promise<void>;
  goToStage: (targetStage: Stage) => Promise<boolean>;
  startOperation: () => Promise<void>;
  stopOperation: (reason?: string) => Promise<void>;
  updateSimulationProgress: (progress: number, elapsedSeconds: number) => Promise<void>;
  resetWorkflow: () => Promise<void>;
  submitCustomScenario: (data: {
    partName: string;
    partNumber: string;
    material: string;
    cncProgram: string;
    cncRevision: string;
    workOffset: string;
    fixture?: string;
  }) => Promise<void>;
  clearToast: () => void;
  showToast: (type: "success" | "error" | "info", text: string) => void;
}

export const useHmiStore = create<HmiStoreState>((set, get) => ({
  hmiState: null,
  isLoading: true,
  isActionLoading: false,
  error: null,
  toast: null,
  operatorName: "Demo Operator",
  isDemoAuthModalOpen: false,
  isCustomInputModalOpen: false,
  isHowItWorksModalOpen: false,
  audioFeedbackEnabled: true,

  setOperatorName: (name: string) => set({ operatorName: name }),
  setDemoAuthModalOpen: (open: boolean) => set({ isDemoAuthModalOpen: open }),
  setCustomInputModalOpen: (open: boolean) => set({ isCustomInputModalOpen: open }),
  setHowItWorksModalOpen: (open: boolean) => set({ isHowItWorksModalOpen: open }),
  toggleAudioFeedback: () => set((s) => ({ audioFeedbackEnabled: !s.audioFeedbackEnabled })),

  showToast: (type, text) => {
    set({ toast: { id: Date.now().toString(), type, text } });
  },

  clearToast: () => set({ toast: null }),

  fetchState: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch("/api/workflow");
      const json = await res.json();
      if (json.success && json.data) {
        set({ hmiState: json.data, isLoading: false });
      } else {
        set({ error: json.message || "Failed to load HMI state", isLoading: false });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Connection error", isLoading: false });
    }
  },

  confirmMachineCheck: async (checkId: string) => {
    const { operatorName, showToast } = get();
    try {
      set({ isActionLoading: true });
      const res = await fetch(`/api/machine-checks/${checkId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operatorName }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        set({ hmiState: json.data, isActionLoading: false });
        showToast("success", "Machine check confirmed");
      } else {
        set({ isActionLoading: false });
        showToast("error", json.message || "Confirmation failed");
      }
    } catch (err) {
      set({ isActionLoading: false });
      showToast("error", "Server communication error");
    }
  },

  confirmToolCheck: async (toolId: string) => {
    const { operatorName, showToast } = get();
    try {
      set({ isActionLoading: true });
      const res = await fetch(`/api/tools/${toolId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operatorName }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        set({ hmiState: json.data, isActionLoading: false });
        showToast("success", "Tool verified & confirmed");
      } else {
        set({ isActionLoading: false });
        showToast("error", json.message || "Tool confirmation failed");
      }
    } catch (err) {
      set({ isActionLoading: false });
      showToast("error", "Server communication error");
    }
  },

  confirmWorkpieceCheck: async (workpieceCheckId: string) => {
    const { operatorName, showToast } = get();
    try {
      set({ isActionLoading: true });
      const res = await fetch("/api/workpiece/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workpieceCheckId, operatorName }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        set({ hmiState: json.data, isActionLoading: false });
        showToast("success", "Workpiece setup step confirmed");
      } else {
        set({ isActionLoading: false });
        showToast("error", json.message || "Workpiece confirmation failed");
      }
    } catch (err) {
      set({ isActionLoading: false });
      showToast("error", "Server communication error");
    }
  },

  goToStage: async (targetStage: Stage): Promise<boolean> => {
    const { showToast } = get();
    try {
      set({ isActionLoading: true });
      const res = await fetch("/api/workflow/next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetStage }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        set({ hmiState: json.data, isActionLoading: false });
        showToast("info", `Stage changed to ${targetStage.replace("_", " ")}`);
        return true;
      } else {
        set({ isActionLoading: false });
        showToast("error", json.message || "Stage transition denied");
        return false;
      }
    } catch (err) {
      set({ isActionLoading: false });
      showToast("error", "Server communication error");
      return false;
    }
  },

  startOperation: async () => {
    const { operatorName, showToast } = get();
    try {
      set({ isActionLoading: true });
      const res = await fetch("/api/operation/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operatorName }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        set({ hmiState: json.data, isActionLoading: false });
        showToast("success", "Machining simulation STARTED — Spindle & feed active");
      } else {
        set({ isActionLoading: false });
        showToast("error", json.message || "Could not start operation");
      }
    } catch (err) {
      set({ isActionLoading: false });
      showToast("error", "Server communication error");
    }
  },

  stopOperation: async (reason: string = "Operator Manual Stop") => {
    const { operatorName, showToast } = get();
    try {
      set({ isActionLoading: true });
      const res = await fetch("/api/operation/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operatorName, reason }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        set({ hmiState: json.data, isActionLoading: false });
        showToast("info", "Machining simulation STOPPED — State preserved");
      } else {
        set({ isActionLoading: false });
        showToast("error", json.message || "Could not stop operation");
      }
    } catch (err) {
      set({ isActionLoading: false });
      showToast("error", "Server communication error");
    }
  },

  updateSimulationProgress: async (progress: number, elapsedSeconds: number) => {
    try {
      const res = await fetch("/api/operation/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress, elapsedSeconds }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        set({ hmiState: json.data });
      }
    } catch (err) {
      // Ignore background ticker errors
    }
  },

  resetWorkflow: async () => {
    const { showToast } = get();
    try {
      set({ isActionLoading: true });
      const res = await fetch("/api/workflow/reset", {
        method: "POST",
      });
      const json = await res.json();
      if (json.success && json.data) {
        set({ hmiState: json.data, isActionLoading: false });
        showToast("info", "HMI workflow reset to initial POWER ON stage");
      } else {
        set({ isActionLoading: false });
        showToast("error", json.message || "Reset failed");
      }
    } catch (err) {
      set({ isActionLoading: false });
      showToast("error", "Server communication error");
    }
  },

  submitCustomScenario: async (data) => {
    const { showToast } = get();
    try {
      set({ isActionLoading: true });
      const res = await fetch("/api/scenario/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success && json.data) {
        set({ hmiState: json.data, isActionLoading: false, isCustomInputModalOpen: false });
        showToast("success", `Custom Part Order Loaded: ${data.partName} (${data.partNumber})`);
      } else {
        set({ isActionLoading: false });
        showToast("error", json.message || "Failed to load custom scenario");
      }
    } catch (err) {
      set({ isActionLoading: false });
      showToast("error", "Server communication error");
    }
  },
}));
