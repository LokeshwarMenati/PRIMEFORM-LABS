import { NextRequest, NextResponse } from "next/server";
import { WorkflowService } from "@/server/workflow-service";
import { StartOperationSchema } from "@/lib/validation/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = StartOperationSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid operation start payload",
        },
        { status: 400 }
      );
    }

    const updatedState = await WorkflowService.startOperation(parseResult.data.operatorName);

    return NextResponse.json({
      success: true,
      data: updatedState,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Operation cannot be started",
      },
      { status: 400 }
    );
  }
}
