import { NextRequest, NextResponse } from "next/server";
import { WorkflowService } from "@/server/workflow-service";
import { ConfirmWorkpieceSchema } from "@/lib/validation/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = ConfirmWorkpieceSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid workpiece confirmation payload",
          errors: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updatedState = await WorkflowService.confirmWorkpieceCheck(
      parseResult.data.workpieceCheckId,
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
        message: error instanceof Error ? error.message : "Workpiece confirmation failed",
      },
      { status: 400 }
    );
  }
}
