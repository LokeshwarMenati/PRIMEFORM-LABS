import { z } from "zod";

export const ConfirmCheckSchema = z.object({
  checkId: z.string().min(1, "Check ID is required"),
  operatorName: z.string().optional().default("Demo Operator"),
});

export const ConfirmToolSchema = z.object({
  toolId: z.string().min(1, "Tool ID is required"),
  operatorName: z.string().optional().default("Demo Operator"),
});

export const ConfirmWorkpieceSchema = z.object({
  workpieceCheckId: z.string().min(1, "Workpiece check ID is required"),
  operatorName: z.string().optional().default("Demo Operator"),
});

export const NextStageSchema = z.object({
  targetStage: z.enum([
    "POWER_ON",
    "MACHINE_CHECKS",
    "TOOLS",
    "WORKPIECE",
    "READY",
    "OPERATION",
  ]),
});

export const StartOperationSchema = z.object({
  operatorName: z.string().optional().default("Demo Operator"),
});

export const StopOperationSchema = z.object({
  operatorName: z.string().optional().default("Demo Operator"),
  reason: z.string().optional().default("Operator Manual Stop"),
});

export const UpdateSimulationProgressSchema = z.object({
  progress: z.number().min(0).max(100),
  elapsedSeconds: z.number().min(0),
});
