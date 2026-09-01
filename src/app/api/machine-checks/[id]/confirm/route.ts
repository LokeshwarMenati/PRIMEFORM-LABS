import { NextRequest, NextResponse } from "next/server";
import { WorkflowService } from "@/server/workflow-service";
import { ConfirmCheckSchema } from "@/lib/validation/schemas";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const checkId = params.id;
    const body = await req.json().catch(() => ({}));
    const parseResult = ConfirmCheckSchema.safeParse({ ...body, checkId });

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid confirmation request payload",
          errors: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updatedState = await WorkflowService.confirmMachineCheck(
      checkId,
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
        message: error instanceof Error ? error.message : "Machine check confirmation failed",
      },
      { status: 400 }
    );
  }
}
