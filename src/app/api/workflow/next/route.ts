import { NextRequest, NextResponse } from "next/server";
import { WorkflowService } from "@/server/workflow-service";
import { NextStageSchema } from "@/lib/validation/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = NextStageSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid stage transition request",
          errors: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updatedState = await WorkflowService.transitionToStage(parseResult.data.targetStage);

    return NextResponse.json({
      success: true,
      data: updatedState,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Stage transition denied",
      },
      { status: 400 }
    );
  }
}
