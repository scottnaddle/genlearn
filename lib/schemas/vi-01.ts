import { z } from "zod";

// VI-01: Infographic Schema
// 한 주제에 대해 SVG 기반 정보 그래픽
// 시각적 데이터 표현 + 차트 포함

export const VI01ChartDataSchema = z.object({
  label: z.string().describe("차트 데이터 라벨"),
  value: z.number().describe("차트 데이터 값"),
  color: z.string().optional().describe("차트 색상 (선택)"),
});

export type VI01ChartData = z.infer<typeof VI01ChartDataSchema>;

export const VI01SectionSchema = z.object({
  title: z
    .string()
    .min(1, "섹션 제목은 필수입니다")
    .describe("섹션 제목"),
  content: z
    .string()
    .min(1, "섹션 내용은 필수입니다")
    .describe("섹션 설명/내용"),
  chartType: z
    .enum(["pie", "bar", "line", "none"])
    .default("none")
    .describe("차트 타입"),
  chartData: z
    .array(VI01ChartDataSchema)
    .optional()
    .describe("차트 데이터 배열"),
});

export type VI01Section = z.infer<typeof VI01SectionSchema>;

export const VI01InfographicSchema = z.object({
  title: z
    .string()
    .min(1, "그래픽 제목은 필수입니다")
    .describe("인포그래픽 제목"),
  sections: z
    .array(VI01SectionSchema)
    .min(1, "섹션은 최소 1개 이상이어야 합니다")
    .describe("섹션별 데이터 배열"),
  svgData: z
    .string()
    .min(1, "SVG 데이터는 필수입니다")
    .describe("SVG 코드"),
  source: z.string().optional().describe("데이터 출처"),
  chartType: z
    .enum(["pie", "bar", "line", "mixed"])
    .default("mixed")
    .describe("주요 차트 타입"),
});

export type VI01Infographic = z.infer<typeof VI01InfographicSchema>;

// Note: JSON Schema export available via Zod's built-in .toJSON() method
// Usage: VI01InfographicSchema.toJSON()