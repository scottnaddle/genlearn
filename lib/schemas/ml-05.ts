import { z } from "zod";

// ML-05: Glossary Snippet Schema
// 전문 용어 하나를 정의 + 유사어/반의어 + 실사용 예문 1~2문장으로 설명
export const ML05GlossarySnippetSchema = z.object({
  term: z.string().min(1, "용어는 필수입니다").describe("전문 용어명"),
  definition: z
    .string()
    .min(10, "정의는 최소 10자 이상이어야 합니다")
    .describe("용어의 명확한 정의"),
  synonyms: z
    .array(z.string())
    .describe("유사어/관련 용어 배열"),
  antonyms: z
    .array(z.string())
    .optional()
    .describe("반의어 배열 (선택)"),
  examples: z
    .array(z.string())
    .min(1, "예시는 최소 1개 이상이어야 합니다")
    .describe("실사용 예문 배열"),
});

export type ML05GlossarySnippet = z.infer<typeof ML05GlossarySnippetSchema>;

// Note: JSON Schema export available via Zod's built-in .toJSON() method
// Usage: ML05GlossarySnippetSchema.toJSON()
