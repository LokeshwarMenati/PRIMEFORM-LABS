import { NextRequest, NextResponse } from "next/server";
import { WorkflowService } from "@/server/workflow-service";
import { UpdateSimulationProgressSchema } from "@/lib/validation/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = UpdateSimulationProgressSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid simulation progress payload",
        },
        { status: 400 }
      );
    }

    const updatedState = await WorkflowService.updateProgress(
      parseResult.data.progress,
      parseResult.data.elapsedSeconds
    );

    return NextResponse.json({
      success: true,
      data: updatedState,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update simulation progress",
      },
      { status: 400 }
    );
  }
}
