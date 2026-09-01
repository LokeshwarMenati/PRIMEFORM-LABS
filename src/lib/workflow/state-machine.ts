import { Stage, OperationStatus } from "../types";
import { STAGE_ORDER } from "../constants";

export interface StateMachineContext {
  currentStage: Stage;
  operationStatus: OperationStatus;
  checksConfirmedCount: number;
  checksTotalCount: number;
  toolsConfirmedCount: number;
  toolsTotalCount: number;
  workpieceConfirmedCount: number;
  workpieceTotalCount: number;
}

export class WorkflowStateMachine {
  /**
   * Evaluates whether a transition from current stage to next target stage is valid.
   */
  static canTransitionTo(context: StateMachineContext, targetStage: Stage): { allowed: boolean; reason?: string } {
    const currentIndex = STAGE_ORDER.indexOf(context.currentStage);
    const targetIndex = STAGE_ORDER.indexOf(targetStage);

    if (currentIndex === -1 || targetIndex === -1) {
      return { allowed: false, reason: "Invalid stage specified" };
    }

    // Allow backward movement to previously completed stages for review
    if (targetIndex < currentIndex) {
      // Cannot return to previous stages while machining is running
      if (context.operationStatus === "RUNNING") {
        return { allowed: false, reason: "Cannot change stage while machining operation is active" };
      }
      return { allowed: true };
    }

    // Cannot skip stages forward
    if (targetIndex > currentIndex + 1) {
      return { allowed: false, reason: "Cannot bypass workflow stages. Sequential completion is required." };
    }

    // Direct transition rules for next stage:
    switch (context.currentStage) {
      case "POWER_ON":
        if (targetStage === "MACHINE_CHECKS") {
          return { allowed: true };
        }
        break;

      case "MACHINE_CHECKS":
        if (targetStage === "TOOLS") {
          if (context.checksConfirmedCount < context.checksTotalCount) {
            return {
              allowed: false,
              reason: `Machine checks incomplete (${context.checksConfirmedCount}/${context.checksTotalCount} confirmed). Confirm all checks to proceed.`,
            };
          }
          return { allowed: true };
        }
        break;

      case "TOOLS":
        if (targetStage === "WORKPIECE") {
          if (context.toolsConfirmedCount < context.toolsTotalCount) {
            return {
              allowed: false,
              reason: `Required tools incomplete (${context.toolsConfirmedCount}/${context.toolsTotalCount} confirmed). Confirm all tools to proceed.`,
            };
          }
          return { allowed: true };
        }
        break;

      case "WORKPIECE":
        if (targetStage === "READY") {
          if (context.workpieceConfirmedCount < context.workpieceTotalCount) {
            return {
              allowed: false,
              reason: `Workpiece setup incomplete (${context.workpieceConfirmedCount}/${context.workpieceTotalCount} confirmed). Confirm setup to proceed.`,
            };
          }
          return { allowed: true };
        }
        break;

      case "READY":
        if (targetStage === "OPERATION") {
          const isFullyPrepared =
            context.checksConfirmedCount === context.checksTotalCount &&
            context.toolsConfirmedCount === context.toolsTotalCount &&
            context.workpieceConfirmedCount === context.workpieceTotalCount;

          if (!isFullyPrepared) {
            return {
              allowed: false,
              reason: "Cannot proceed to operation. Prerequisite checklists are incomplete.",
            };
          }
          return { allowed: true };
        }
        break;

      case "OPERATION":
        return { allowed: false, reason: "Already at final operation stage" };
    }

    return { allowed: false, reason: `Transition from ${context.currentStage} to ${targetStage} is not permitted.` };
  }

  /**
   * Validates operation start capability.
   */
  static canStartOperation(context: StateMachineContext): { allowed: boolean; reason?: string } {
    if (context.currentStage !== "OPERATION") {
      return { allowed: false, reason: "Operation can only be started from the OPERATION stage screen." };
    }

    const isFullyPrepared =
      context.checksConfirmedCount === context.checksTotalCount &&
      context.toolsConfirmedCount === context.toolsTotalCount &&
      context.workpieceConfirmedCount === context.workpieceTotalCount;

    if (!isFullyPrepared) {
      return { allowed: false, reason: "Safety lock: Startup checklists incomplete." };
    }

    if (context.operationStatus === "RUNNING") {
      return { allowed: false, reason: "Machining simulation is already running." };
    }

    return { allowed: true };
  }

  /**
   * Validates operation stop capability.
   */
  static canStopOperation(context: StateMachineContext): { allowed: boolean; reason?: string } {
    if (context.operationStatus !== "RUNNING") {
      return { allowed: false, reason: "Operation is not currently running." };
    }
    return { allowed: true };
  }
}
