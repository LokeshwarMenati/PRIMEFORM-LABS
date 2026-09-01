import { NextRequest, NextResponse } from "next/server";
import { WorkflowService } from "@/server/workflow-service";
import { z } from "zod";

const CustomScenarioSchema = z.object({
  partName: z.string().min(1, "Part name is required"),
  partNumber: z.string().min(1, "Part number is required"),
  material: z.string().min(1, "Material is required"),
  cncProgram: z.string().min(1, "CNC program is required"),
  cncRevision: z.string().min(1, "CNC revision is required"),
  workOffset: z.string().min(1, "Work offset is required"),
  fixture: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = CustomScenarioSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid custom scenario input payload",
          errors: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updatedState = await WorkflowService.updateCustomScenario(parseResult.data);

    return NextResponse.json({
      success: true,
      data: updatedState,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to load custom scenario input",
      },
      { status: 500 }
    );
  }
}
