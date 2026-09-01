import { NextRequest, NextResponse } from "next/server";
import { WorkflowService } from "@/server/workflow-service";
import { StopOperationSchema } from "@/lib/validation/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = StopOperationSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid operation stop payload",
        },
        { status: 400 }
      );
    }

    const updatedState = await WorkflowService.stopOperation(
      parseResult.data.operatorName,
      parseResult.data.reason
    );

    return NextResponse.json({
      success: true,
      data: updatedState,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Operation cannot be stopped",
      },
      { status: 400 }
    );
  }
}
