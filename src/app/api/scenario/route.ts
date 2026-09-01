import { NextResponse } from "next/server";
import { WorkflowService } from "@/server/workflow-service";

export async function GET() {
  try {
    const state = await WorkflowService.getFullHmiState();
    return NextResponse.json({
      success: true,
      scenario: state.scenario,
      machine: state.machine,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to load scenario" },
      { status: 500 }
    );
  }
}
