import { prisma } from "../lib/db";
import { FullHmiState, Stage } from "../lib/types";
import { WorkflowStateMachine } from "../lib/workflow/state-machine";

export class WorkflowService {
  /**
   * Retrieves complete HMI state from database source-of-truth.
   */
  static async getFullHmiState(): Promise<FullHmiState> {
    let machine = await prisma.machine.findUnique({ where: { id: "VMC-01" } });
    if (!machine) {
      machine = await prisma.machine.create({
        data: {
          id: "VMC-01",
          name: "Primeform VMC 500",
          machineCode: "VMC-01",
          powerStatus: "ONLINE",
          safetyStatus: "CLEAR",
          controlStatus: "READY",
          connectionStatus: "CONNECTED",
        },
      });
    }

    let scenario = await prisma.scenario.findUnique({ where: { id: "SCEN-01" } });
    if (!scenario) {
      scenario = await prisma.scenario.create({
        data: {
          id: "SCEN-01",
          partName: "VMC Housing Plate",
          partNumber: "PF-VM-001",
          quantity: 1,
          material: "Aluminium 6061-T6",
          drawingRevision: "Rev B",
          cncProgram: "O1001",
          cncRevision: "Rev 03",
          fixture: "Precision machine vise, Fixed parallels",
          workOffset: "G54",
          operationId: "OP-20",
          operationName: "Face Milling + Pocket Machining",
        },
      });
    }

    const checks = await prisma.machineCheck.findMany({
      where: { scenarioId: scenario.id },
      orderBy: { order: "asc" },
    });

    const tools = await prisma.toolCheck.findMany({
      where: { scenarioId: scenario.id },
      orderBy: { order: "asc" },
    });

    const workpieceChecks = await prisma.workpieceCheck.findMany({
      where: { scenarioId: scenario.id },
      orderBy: { order: "asc" },
    });

    let workflow = await prisma.workflowState.findUnique({ where: { id: "CURRENT" } });
    if (!workflow) {
      workflow = await prisma.workflowState.create({
        data: {
          id: "CURRENT",
          scenarioId: scenario.id,
          currentStage: "POWER_ON",
          currentItemIndex: 0,
          operationStatus: "READY",
          simulatedProgress: 0.0,
          elapsedSeconds: 0,
          operatorName: "Demo Operator",
          lastAuditNote: "System initialized",
        },
      });
    }

    const checksConfirmedCount = checks.filter((c) => c.confirmed).length;
    const toolsConfirmedCount = tools.filter((t) => t.confirmed).length;
    const workpieceConfirmedCount = workpieceChecks.filter((w) => w.confirmed).length;

    const isFullyPrepared =
      checks.length > 0 &&
      checksConfirmedCount === checks.length &&
      tools.length > 0 &&
      toolsConfirmedCount === tools.length &&
      workpieceChecks.length > 0 &&
      workpieceConfirmedCount === workpieceChecks.length;

    return {
      machine: {
        id: machine.id,
        name: machine.name,
        machineCode: machine.machineCode,
        powerStatus: machine.powerStatus,
        safetyStatus: machine.safetyStatus,
        controlStatus: machine.controlStatus,
        connectionStatus: machine.connectionStatus,
        updatedAt: machine.updatedAt.toISOString(),
      },
      scenario: {
        id: scenario.id,
        partName: scenario.partName,
        partNumber: scenario.partNumber,
        quantity: scenario.quantity,
        material: scenario.material,
        drawingRevision: scenario.drawingRevision,
        cncProgram: scenario.cncProgram,
        cncRevision: scenario.cncRevision,
        fixture: scenario.fixture,
        workOffset: scenario.workOffset,
        operationId: scenario.operationId,
        operationName: scenario.operationName,
      },
      checks: checks.map((c) => ({
        id: c.id,
        code: c.code,
        title: c.title,
        instruction: c.instruction,
        order: c.order,
        confirmed: c.confirmed,
        confirmedAt: c.confirmedAt ? c.confirmedAt.toISOString() : null,
        confirmedBy: c.confirmedBy,
      })),
      tools: tools.map((t) => ({
        id: t.id,
        toolNumber: t.toolNumber,
        toolType: t.toolType,
        purpose: t.purpose,
        cncProgram: t.cncProgram,
        cncRevision: t.cncRevision,
        order: t.order,
        confirmed: t.confirmed,
        confirmedAt: t.confirmedAt ? t.confirmedAt.toISOString() : null,
        confirmedBy: t.confirmedBy,
      })),
      workpieceChecks: workpieceChecks.map((w) => ({
        id: w.id,
        stepName: w.stepName,
        instruction: w.instruction,
        fixtureDetails: w.fixtureDetails,
        workOffsetDetails: w.workOffsetDetails,
        orientationDetails: w.orientationDetails,
        materialDetails: w.materialDetails,
        drawingDetails: w.drawingDetails,
        order: w.order,
        confirmed: w.confirmed,
        confirmedAt: w.confirmedAt ? w.confirmedAt.toISOString() : null,
        confirmedBy: w.confirmedBy,
      })),
      workflow: {
        id: workflow.id,
        scenarioId: workflow.scenarioId,
        currentStage: workflow.currentStage as Stage,
        currentItemIndex: workflow.currentItemIndex,
        operationStatus: workflow.operationStatus as "READY" | "RUNNING" | "STOPPED",
        simulatedProgress: workflow.simulatedProgress,
        elapsedSeconds: workflow.elapsedSeconds,
        operatorName: workflow.operatorName,
        lastAuditNote: workflow.lastAuditNote,
        updatedAt: workflow.updatedAt.toISOString(),
      },
      stats: {
        checksConfirmedCount,
        checksTotalCount: checks.length,
        toolsConfirmedCount,
        toolsTotalCount: tools.length,
        workpieceConfirmedCount,
        workpieceTotalCount: workpieceChecks.length,
        isFullyPrepared,
      },
    };
  }

  /**
   * Confirms a specific machine check item.
   */
  static async confirmMachineCheck(checkId: string, operatorName: string = "Demo Operator"): Promise<FullHmiState> {
    const check = await prisma.machineCheck.findUnique({ where: { id: checkId } });
    if (!check) {
      throw new Error("Machine check record not found");
    }

    await prisma.machineCheck.update({
      where: { id: checkId },
      data: {
        confirmed: true,
        confirmedAt: new Date(),
        confirmedBy: operatorName,
      },
    });

    // Update workflow audit note & advance index if needed
    const state = await this.getFullHmiState();
    const nextUnconfirmedIdx = state.checks.findIndex((c) => !c.confirmed);
    const newIdx = nextUnconfirmedIdx !== -1 ? nextUnconfirmedIdx : state.checks.length - 1;

    await prisma.workflowState.update({
      where: { id: "CURRENT" },
      data: {
        currentItemIndex: Math.max(0, newIdx),
        lastAuditNote: `Confirmed machine check: ${check.title} by ${operatorName}`,
      },
    });

    return this.getFullHmiState();
  }

  /**
   * Confirms a specific tool check item.
   */
  static async confirmToolCheck(toolId: string, operatorName: string = "Demo Operator"): Promise<FullHmiState> {
    const tool = await prisma.toolCheck.findUnique({ where: { id: toolId } });
    if (!tool) {
      throw new Error("Tool check record not found");
    }

    await prisma.toolCheck.update({
      where: { id: toolId },
      data: {
        confirmed: true,
        confirmedAt: new Date(),
        confirmedBy: operatorName,
      },
    });

    const state = await this.getFullHmiState();
    const nextUnconfirmedIdx = state.tools.findIndex((t) => !t.confirmed);
    const newIdx = nextUnconfirmedIdx !== -1 ? nextUnconfirmedIdx : state.tools.length - 1;

    await prisma.workflowState.update({
      where: { id: "CURRENT" },
      data: {
        currentItemIndex: Math.max(0, newIdx),
        lastAuditNote: `Confirmed tool: ${tool.toolNumber} (${tool.toolType}) by ${operatorName}`,
      },
    });

    return this.getFullHmiState();
  }

  /**
   * Confirms a specific workpiece setup item.
   */
  static async confirmWorkpieceCheck(workpieceCheckId: string, operatorName: string = "Demo Operator"): Promise<FullHmiState> {
    const wp = await prisma.workpieceCheck.findUnique({ where: { id: workpieceCheckId } });
    if (!wp) {
      throw new Error("Workpiece check record not found");
    }

    await prisma.workpieceCheck.update({
      where: { id: workpieceCheckId },
      data: {
        confirmed: true,
        confirmedAt: new Date(),
        confirmedBy: operatorName,
      },
    });

    const state = await this.getFullHmiState();
    const nextUnconfirmedIdx = state.workpieceChecks.findIndex((w) => !w.confirmed);
    const newIdx = nextUnconfirmedIdx !== -1 ? nextUnconfirmedIdx : state.workpieceChecks.length - 1;

    await prisma.workflowState.update({
      where: { id: "CURRENT" },
      data: {
        currentItemIndex: Math.max(0, newIdx),
        lastAuditNote: `Confirmed workpiece step: ${wp.stepName} by ${operatorName}`,
      },
    });

    return this.getFullHmiState();
  }

  /**
   * Transitions to a new target stage with state machine validation.
   */
  static async transitionToStage(targetStage: Stage): Promise<FullHmiState> {
    const currentState = await this.getFullHmiState();

    const validation = WorkflowStateMachine.canTransitionTo(
      {
        currentStage: currentState.workflow.currentStage,
        operationStatus: currentState.workflow.operationStatus,
        checksConfirmedCount: currentState.stats.checksConfirmedCount,
        checksTotalCount: currentState.stats.checksTotalCount,
        toolsConfirmedCount: currentState.stats.toolsConfirmedCount,
        toolsTotalCount: currentState.stats.toolsTotalCount,
        workpieceConfirmedCount: currentState.stats.workpieceConfirmedCount,
        workpieceTotalCount: currentState.stats.workpieceTotalCount,
      },
      targetStage
    );

    if (!validation.allowed) {
      throw new Error(validation.reason || "Stage transition denied");
    }

    await prisma.workflowState.update({
      where: { id: "CURRENT" },
      data: {
        currentStage: targetStage,
        currentItemIndex: 0,
        lastAuditNote: `Advanced to stage: ${targetStage}`,
      },
    });

    return this.getFullHmiState();
  }

  /**
   * Starts machining simulation.
   */
  static async startOperation(operatorName: string = "Demo Operator"): Promise<FullHmiState> {
    const currentState = await this.getFullHmiState();

    const validation = WorkflowStateMachine.canStartOperation({
      currentStage: currentState.workflow.currentStage,
      operationStatus: currentState.workflow.operationStatus,
      checksConfirmedCount: currentState.stats.checksConfirmedCount,
      checksTotalCount: currentState.stats.checksTotalCount,
      toolsConfirmedCount: currentState.stats.toolsConfirmedCount,
      toolsTotalCount: currentState.stats.toolsTotalCount,
      workpieceConfirmedCount: currentState.stats.workpieceConfirmedCount,
      workpieceTotalCount: currentState.stats.workpieceTotalCount,
    });

    if (!validation.allowed) {
      throw new Error(validation.reason || "Cannot start operation");
    }

    await prisma.workflowState.update({
      where: { id: "CURRENT" },
      data: {
        operationStatus: "RUNNING",
        operatorName,
        lastAuditNote: `Machining operation started by ${operatorName}`,
      },
    });

    return this.getFullHmiState();
  }

  /**
   * Stops machining simulation while preserving current progress.
   */
  static async stopOperation(operatorName: string = "Demo Operator", reason: string = "Operator Manual Stop"): Promise<FullHmiState> {
    const currentState = await this.getFullHmiState();

    const validation = WorkflowStateMachine.canStopOperation({
      currentStage: currentState.workflow.currentStage,
      operationStatus: currentState.workflow.operationStatus,
      checksConfirmedCount: currentState.stats.checksConfirmedCount,
      checksTotalCount: currentState.stats.checksTotalCount,
      toolsConfirmedCount: currentState.stats.toolsConfirmedCount,
      toolsTotalCount: currentState.stats.toolsTotalCount,
      workpieceConfirmedCount: currentState.stats.workpieceConfirmedCount,
      workpieceTotalCount: currentState.stats.workpieceTotalCount,
    });

    if (!validation.allowed) {
      throw new Error(validation.reason || "Cannot stop operation");
    }

    await prisma.workflowState.update({
      where: { id: "CURRENT" },
      data: {
        operationStatus: "STOPPED",
        lastAuditNote: `Operation stopped by ${operatorName}: ${reason}`,
      },
    });

    return this.getFullHmiState();
  }

  /**
   * Updates simulated progress percentage and elapsed timer during active run.
   */
  static async updateProgress(progress: number, elapsedSeconds: number): Promise<FullHmiState> {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    const isCompleted = clampedProgress >= 100;

    await prisma.workflowState.update({
      where: { id: "CURRENT" },
      data: {
        simulatedProgress: clampedProgress,
        elapsedSeconds,
        operationStatus: isCompleted ? "STOPPED" : undefined,
        lastAuditNote: isCompleted ? "Machining cycle completed successfully" : undefined,
      },
    });

    return this.getFullHmiState();
  }

  /**
   * Resets entire workflow back to initial state for demo repeatability.
   */
  static async resetWorkflow(): Promise<FullHmiState> {
    await prisma.machineCheck.updateMany({
      data: { confirmed: false, confirmedAt: null, confirmedBy: null },
    });
    await prisma.toolCheck.updateMany({
      data: { confirmed: false, confirmedAt: null, confirmedBy: null },
    });
    await prisma.workpieceCheck.updateMany({
      data: { confirmed: false, confirmedAt: null, confirmedBy: null },
    });

    await prisma.workflowState.update({
      where: { id: "CURRENT" },
      data: {
        currentStage: "POWER_ON",
        currentItemIndex: 0,
        operationStatus: "READY",
        simulatedProgress: 0.0,
        elapsedSeconds: 0,
        lastAuditNote: "Workflow reset to initial state",
      },
    });

    return this.getFullHmiState();
  }
}
