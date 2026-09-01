import { NextResponse } from "next/server";
import { WorkflowService } from "@/server/workflow-service";

export async function GET() {
  try {
    const state = await WorkflowService.getFullHmiState();
    return NextResponse.json({
      success: true,
      data: state,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to load workflow state",
      },
      { status: 500 }
    );
  }
}
