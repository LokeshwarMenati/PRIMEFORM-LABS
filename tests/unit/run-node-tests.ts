import { WorkflowStateMachine, StateMachineContext } from "../../src/lib/workflow/state-machine";

function runTests() {
  console.log("=== RUNNING STATE MACHINE UNIT TESTS ===");

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

  // Test 1: POWER_ON -> MACHINE_CHECKS
  const t1 = WorkflowStateMachine.canTransitionTo(baseContext, "MACHINE_CHECKS");
  if (!t1.allowed) throw new Error("Test 1 Failed");
  console.log("✔ Test 1 Passed: POWER_ON -> MACHINE_CHECKS allowed");

  // Test 2: Incomplete machine checks block transition to TOOLS
  const t2 = WorkflowStateMachine.canTransitionTo({ ...baseContext, currentStage: "MACHINE_CHECKS", checksConfirmedCount: 5 }, "TOOLS");
  if (t2.allowed) throw new Error("Test 2 Failed");
  console.log("✔ Test 2 Passed: Incomplete checks (5/6) blocks TOOLS transition");

  // Test 3: Complete machine checks allow transition to TOOLS
  const t3 = WorkflowStateMachine.canTransitionTo({ ...baseContext, currentStage: "MACHINE_CHECKS", checksConfirmedCount: 6 }, "TOOLS");
  if (!t3.allowed) throw new Error("Test 3 Failed");
  console.log("✔ Test 3 Passed: Complete checks (6/6) allows TOOLS transition");

  // Test 4: Incomplete tools block transition to WORKPIECE
  const t4 = WorkflowStateMachine.canTransitionTo({ ...baseContext, currentStage: "TOOLS", checksConfirmedCount: 6, toolsConfirmedCount: 3 }, "WORKPIECE");
  if (t4.allowed) throw new Error("Test 4 Failed");
  console.log("✔ Test 4 Passed: Incomplete tools (3/4) blocks WORKPIECE transition");

  // Test 5: Complete tools allow transition to WORKPIECE
  const t5 = WorkflowStateMachine.canTransitionTo({ ...baseContext, currentStage: "TOOLS", checksConfirmedCount: 6, toolsConfirmedCount: 4 }, "WORKPIECE");
  if (!t5.allowed) throw new Error("Test 5 Failed");
  console.log("✔ Test 5 Passed: Complete tools (4/4) allows WORKPIECE transition");

  // Test 6: Incomplete workpiece setup blocks READY review
  const t6 = WorkflowStateMachine.canTransitionTo({ ...baseContext, currentStage: "WORKPIECE", checksConfirmedCount: 6, toolsConfirmedCount: 4, workpieceConfirmedCount: 2 }, "READY");
  if (t6.allowed) throw new Error("Test 6 Failed");
  console.log("✔ Test 6 Passed: Incomplete workpiece (2/4) blocks READY transition");

  // Test 7: Complete workpiece setup allows READY review
  const t7 = WorkflowStateMachine.canTransitionTo({ ...baseContext, currentStage: "WORKPIECE", checksConfirmedCount: 6, toolsConfirmedCount: 4, workpieceConfirmedCount: 4 }, "READY");
  if (!t7.allowed) throw new Error("Test 7 Failed");
  console.log("✔ Test 7 Passed: Complete workpiece (4/4) allows READY transition");

  // Test 8: Stage skipping rejected
  const t8 = WorkflowStateMachine.canTransitionTo(baseContext, "OPERATION");
  if (t8.allowed) throw new Error("Test 8 Failed");
  console.log("✔ Test 8 Passed: Direct jump POWER_ON -> OPERATION rejected");

  // Test 9: Operation cannot start from READY stage
  const t9 = WorkflowStateMachine.canStartOperation({ ...baseContext, currentStage: "READY", checksConfirmedCount: 6, toolsConfirmedCount: 4, workpieceConfirmedCount: 4 });
  if (t9.allowed) throw new Error("Test 9 Failed");
  console.log("✔ Test 9 Passed: Cannot start operation from READY stage");

  // Test 10: Operation can start from OPERATION stage when 100% prepared
  const t10 = WorkflowStateMachine.canStartOperation({ ...baseContext, currentStage: "OPERATION", operationStatus: "READY", checksConfirmedCount: 6, toolsConfirmedCount: 4, workpieceConfirmedCount: 4 });
  if (!t10.allowed) throw new Error("Test 10 Failed");
  console.log("✔ Test 10 Passed: Operation start allowed when fully prepared");

  // Test 11: Operation stop allowed when RUNNING
  const t11 = WorkflowStateMachine.canStopOperation({ ...baseContext, currentStage: "OPERATION", operationStatus: "RUNNING" });
  if (!t11.allowed) throw new Error("Test 11 Failed");
  console.log("✔ Test 11 Passed: Operation stop allowed when RUNNING");

  console.log("\nALL 11 UNIT TESTS PASSED SUCCESSFULLY! 🚀");
}

runTests();
