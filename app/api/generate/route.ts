import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { executeSkill, getAvailableTypes } from "@/lib/skill-registry";
import { validate } from "@/lib/validator";

// ============================================
// Request Schema
// ============================================

const CONTENT_TYPE_IDS = ["ML-01", "ML-05"] as const;
type ContentTypeId = (typeof CONTENT_TYPE_IDS)[number];

const GenerateRequestSchema = z.object({
  contentTypeId: z.enum(CONTENT_TYPE_IDS, {
    message: `contentTypeId는 'ML-01' 또는 'ML-05'이어야 합니다.`,
  }),
  topic: z
    .string()
    .min(1, "topic은 필수입니다")
    .max(200, "topic은 200자를 초과할 수 없습니다"),
  purpose: z
    .string()
    .min(1, "purpose는 필수입니다")
    .max(500, "purpose는 500자를 초과할 수 없습니다"),
  category: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
});

// Re-export type
export type { ContentTypeId };
export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;

// ============================================
// API Route Handler
// ============================================

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const parseResult = GenerateRequestSchema.safeParse(body);

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`);
      return NextResponse.json(
        {
          success: false,
          error: "입력 검증 실패",
          details: errors,
          availableTypes: getAvailableTypes(),
        },
        { status: 400 }
      );
    }

    const { contentTypeId, topic, purpose, category, level } = parseResult.data;

    // 2. Execute skill (content generation)
    const skillOutput = await executeSkill(contentTypeId, {
      topic,
      purpose,
      category,
      level,
    });

    // 3. Validate output against schema
    const validation = validate(contentTypeId, skillOutput.data);

    // 4. Build response
    const response = {
      success: validation.valid,
      contentTypeId,
      input: {
        topic,
        purpose,
        category,
        level,
      },
      output: skillOutput.data,
      validation: {
        valid: validation.valid,
        errors: validation.errors,
        validatedAt: validation.validatedAt,
      },
      generatedAt: skillOutput.generatedAt,
    };

    // 5. Return response
    // - 200 if validation passed
    // - 200 with success: false if validation failed (graceful degradation)
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("[API /api/generate] Error:", error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("Unknown content type")) {
        return NextResponse.json(
          {
            success: false,
            error: "지원되지 않는 콘텐츠 타입입니다",
            availableTypes: getAvailableTypes(),
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `콘텐츠 생성 중 오류가 발생했습니다: ${error.message}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "예기치 않은 오류가 발생했습니다",
      },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
