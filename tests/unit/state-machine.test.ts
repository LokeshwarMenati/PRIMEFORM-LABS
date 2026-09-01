import { describe, it, expect } from "vitest";
import { WorkflowStateMachine, StateMachineContext } from "../../src/lib/workflow/state-machine";

describe("WorkflowStateMachine", () => {
  const baseContext: StateMachineContext = {
    currentStage: "POWER_ON",
    operationStatus: "READY",
    checksConfirmedCount: 0,
    checksTotalCount: 6,
    toolsConfirmedCount: 0,
    toolsTotalCount: 4,
    workpieceConfirmedCount: 0,
    workpieceTotalCount: 4,
  };

  it("1. Allows transition from POWER_ON to MACHINE_CHECKS", () => {
    const result = WorkflowStateMachine.canTransitionTo(baseContext, "MACHINE_CHECKS");
    expect(result.allowed).toBe(true);
  });

  it("2. Blocks transition from MACHINE_CHECKS to TOOLS when checks are incomplete", () => {
    const ctx: StateMachineContext = {
      ...baseContext,
      currentStage: "MACHINE_CHECKS",
      checksConfirmedCount: 5, // 5/6
    };
    const result = WorkflowStateMachine.canTransitionTo(ctx, "TOOLS");
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Machine checks incomplete");
  });

  it("3. Allows transition from MACHINE_CHECKS to TOOLS when all 6 checks are confirmed", () => {
    const ctx: StateMachineContext = {
      ...baseContext,
      currentStage: "MACHINE_CHECKS",
      checksConfirmedCount: 6,
    };
    const result = WorkflowStateMachine.canTransitionTo(ctx, "TOOLS");
    expect(result.allowed).toBe(true);
  });

  it("4. Blocks transition from TOOLS to WORKPIECE when tools are incomplete", () => {
    const ctx: StateMachineContext = {
      ...baseContext,
      currentStage: "TOOLS",
      checksConfirmedCount: 6,
      toolsConfirmedCount: 3, // 3/4
    };
    const result = WorkflowStateMachine.canTransitionTo(ctx, "WORKPIECE");
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Required tools incomplete");
  });

  it("5. Allows transition from TOOLS to WORKPIECE when all 4 tools are confirmed", () => {
    const ctx: StateMachineContext = {
      ...baseContext,
      currentStage: "TOOLS",
      checksConfirmedCount: 6,
      toolsConfirmedCount: 4,
    };
    const result = WorkflowStateMachine.canTransitionTo(ctx, "WORKPIECE");
    expect(result.allowed).toBe(true);
  });

  it("6. Blocks transition from WORKPIECE to READY when workpiece setup is incomplete", () => {
    const ctx: StateMachineContext = {
      ...baseContext,
      currentStage: "WORKPIECE",
      checksConfirmedCount: 6,
      toolsConfirmedCount: 4,
      workpieceConfirmedCount: 2, // 2/4
    };
    const result = WorkflowStateMachine.canTransitionTo(ctx, "READY");
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Workpiece setup incomplete");
  });

  it("7. Allows transition from WORKPIECE to READY when workpiece setup is 100% complete", () => {
    const ctx: StateMachineContext = {
      ...baseContext,
      currentStage: "WORKPIECE",
      checksConfirmedCount: 6,
      toolsConfirmedCount: 4,
      workpieceConfirmedCount: 4,
    };
    const result = WorkflowStateMachine.canTransitionTo(ctx, "READY");
    expect(result.allowed).toBe(true);
  });

  it("8. Rejects stage skipping (e.g. POWER_ON directly to OPERATION)", () => {
    const result = WorkflowStateMachine.canTransitionTo(baseContext, "OPERATION");
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Cannot bypass workflow stages");
  });

  it("9. Validates operation start rules: fails when not at OPERATION stage", () => {
    const ctx: StateMachineContext = {
      ...baseContext,
      currentStage: "READY",
      checksConfirmedCount: 6,
      toolsConfirmedCount: 4,
      workpieceConfirmedCount: 4,
    };
    const result = WorkflowStateMachine.canStartOperation(ctx);
    expect(result.allowed).toBe(false);
  });

  it("10. Validates operation start rules: succeeds at OPERATION stage when fully prepared", () => {
    const ctx: StateMachineContext = {
      ...baseContext,
      currentStage: "OPERATION",
      operationStatus: "READY",
      checksConfirmedCount: 6,
      toolsConfirmedCount: 4,
      workpieceConfirmedCount: 4,
    };
    const result = WorkflowStateMachine.canStartOperation(ctx);
    expect(result.allowed).toBe(true);
  });

  it("11. Validates operation stop rules: allowed when status is RUNNING", () => {
    const ctx: StateMachineContext = {
      ...baseContext,
      currentStage: "OPERATION",
      operationStatus: "RUNNING",
    };
    const result = WorkflowStateMachine.canStopOperation(ctx);
    expect(result.allowed).toBe(true);
  });
});
