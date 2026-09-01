import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Primeform Labs VMC Operator HMI database...");

  // Seed Machine Status
  await prisma.machine.upsert({
    where: { id: "VMC-01" },
    update: {
      powerStatus: "ONLINE",
      safetyStatus: "CLEAR",
      controlStatus: "READY",
      connectionStatus: "CONNECTED",
    },
    create: {
      id: "VMC-01",
      name: "Primeform VMC 500",
      machineCode: "VMC-01",
      powerStatus: "ONLINE",
      safetyStatus: "CLEAR",
      controlStatus: "READY",
      connectionStatus: "CONNECTED",
    },
  });

  // Seed Mock Scenario
  const scenario = await prisma.scenario.upsert({
    where: { id: "SCEN-01" },
    update: {
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
    create: {
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

  // Clear existing check records for re-seed idempotency
  await prisma.machineCheck.deleteMany({ where: { scenarioId: scenario.id } });
  await prisma.toolCheck.deleteMany({ where: { scenarioId: scenario.id } });
  await prisma.workpieceCheck.deleteMany({ where: { scenarioId: scenario.id } });

  // Seed Machine Checks
  const machineChecksData = [
    {
      code: "CHK-01",
      title: "Power / Control Available",
      instruction: "Verify 3-phase main power supply and cabinet control power are energized.",
      order: 1,
    },
    {
      code: "CHK-02",
      title: "E-Stop Released",
      instruction: "Inspect emergency stop pushbuttons on HMI panel and pendant controller. Ensure E-stop circuit is reset.",
      order: 2,
    },
    {
      code: "CHK-03",
      title: "Guard / Door Closed",
      instruction: "Close main spindle enclosure safety door and verify interlock switch engaged signal.",
      order: 3,
    },
    {
      code: "CHK-04",
      title: "No Active Alarm",
      instruction: "Confirm CNC diagnostic panel indicates zero active safety faults or axis servo alarms.",
      order: 4,
    },
    {
      code: "CHK-05",
      title: "Lubrication / Coolant Ready",
      instruction: "Check automatic guideway lube reservoir and verify flood coolant tank level (≥80%).",
      order: 5,
    },
    {
      code: "CHK-06",
      title: "Reference Return Complete",
      instruction: "Execute machine zero-return homing sequence for X, Y, and Z axes.",
      order: 6,
    },
  ];

  for (const check of machineChecksData) {
    await prisma.machineCheck.create({
      data: {
        scenarioId: scenario.id,
        ...check,
        confirmed: false,
      },
    });
  }

  // Seed Tool Checks
  const toolChecksData = [
    {
      toolNumber: "T01",
      toolType: "Ø50 mm Face Mill",
      purpose: "Face milling",
      cncProgram: "O1001",
      cncRevision: "Rev 03",
      order: 1,
    },
    {
      toolNumber: "T02",
      toolType: "Ø10 mm Carbide End Mill",
      purpose: "Rough pocket machining",
      cncProgram: "O1001",
      cncRevision: "Rev 03",
      order: 2,
    },
    {
      toolNumber: "T03",
      toolType: "Ø6 mm Carbide End Mill",
      purpose: "Pocket finishing",
      cncProgram: "O1001",
      cncRevision: "Rev 03",
      order: 3,
    },
    {
      toolNumber: "T04",
      toolType: "Ø6 mm Drill",
      purpose: "Drilling",
      cncProgram: "O1001",
      cncRevision: "Rev 03",
      order: 4,
    },
  ];

  for (const tool of toolChecksData) {
    await prisma.toolCheck.create({
      data: {
        scenarioId: scenario.id,
        ...tool,
        confirmed: false,
      },
    });
  }

  // Seed Workpiece Checks
  const workpieceChecksData = [
    {
      stepName: "Fixture Alignment & Parallels",
      instruction: "Mount precision machine vise on T-slot table with ground parallel bars placed flush.",
      fixtureDetails: "Precision machine vise, Fixed parallels",
      workOffsetDetails: "G54",
      orientationDetails: "Stock flat on parallels against fixed jaw",
      materialDetails: "Aluminium 6061-T6",
      drawingDetails: "PF-VM-001 Rev B",
      order: 1,
    },
    {
      stepName: "Stock Loading & Seating",
      instruction: "Position Aluminium 6061-T6 raw plate (PF-VM-001) against work stop reference pin.",
      fixtureDetails: "Precision machine vise, Fixed parallels",
      workOffsetDetails: "G54",
      orientationDetails: "Stock flat on parallels against fixed jaw",
      materialDetails: "Aluminium 6061-T6",
      drawingDetails: "PF-VM-001 Rev B",
      order: 2,
    },
    {
      stepName: "Clamping Torque Verification",
      instruction: "Tighten vise spindle lead screw to 45 Nm torque using calibrated torque wrench.",
      fixtureDetails: "Precision machine vise, Fixed parallels",
      workOffsetDetails: "G54",
      orientationDetails: "Stock flat on parallels against fixed jaw",
      materialDetails: "Aluminium 6061-T6",
      drawingDetails: "PF-VM-001 Rev B",
      order: 3,
    },
    {
      stepName: "Work Offset G54 Verification",
      instruction: "Confirm G54 X0 Y0 Z0 origin values in CNC controller match drawing datum PF-VM-001 Rev B.",
      fixtureDetails: "Precision machine vise, Fixed parallels",
      workOffsetDetails: "G54",
      orientationDetails: "Stock flat on parallels against fixed jaw",
      materialDetails: "Aluminium 6061-T6",
      drawingDetails: "PF-VM-001 Rev B",
      order: 4,
    },
  ];

  for (const wp of workpieceChecksData) {
    await prisma.workpieceCheck.create({
      data: {
        scenarioId: scenario.id,
        ...wp,
        confirmed: false,
      },
    });
  }

  // Reset Workflow State to POWER_ON
  await prisma.workflowState.upsert({
    where: { id: "CURRENT" },
    update: {
      scenarioId: scenario.id,
      currentStage: "POWER_ON",
      currentItemIndex: 0,
      operationStatus: "READY",
      simulatedProgress: 0.0,
      elapsedSeconds: 0,
      operatorName: "Demo Operator",
      lastAuditNote: "System initialized for startup workflow",
    },
    create: {
      id: "CURRENT",
      scenarioId: scenario.id,
      currentStage: "POWER_ON",
      currentItemIndex: 0,
      operationStatus: "READY",
      simulatedProgress: 0.0,
      elapsedSeconds: 0,
      operatorName: "Demo Operator",
      lastAuditNote: "System initialized for startup workflow",
    },
  });

  console.log("Database successfully seeded!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
