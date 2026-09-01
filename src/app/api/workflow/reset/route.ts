import { NextResponse } from "next/server";
import { WorkflowService } from "@/server/workflow-service";

export async function POST() {
  try {
    const updatedState = await WorkflowService.resetWorkflow();
    return NextResponse.json({
      success: true,
      data: updatedState,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to reset workflow",
      },
      { status: 500 }
    );
  }
}
