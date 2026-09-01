import { NextRequest, NextResponse } from "next/server";
import { WorkflowService } from "@/server/workflow-service";
import { ConfirmToolSchema } from "@/lib/validation/schemas";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const toolId = params.id;
    const body = await req.json().catch(() => ({}));
    const parseResult = ConfirmToolSchema.safeParse({ ...body, toolId });

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid tool confirmation payload",
          errors: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updatedState = await WorkflowService.confirmToolCheck(
      toolId,
      parseResult.data.operatorName
    );

    return NextResponse.json({
      success: true,
      data: updatedState,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Tool confirmation failed",
      },
      { status: 400 }
    );
  }
}
