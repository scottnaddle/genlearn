import { z } from "zod";

// ML-02: Episode Card Schema
// 한 주제에 대해 "하나의 제목 + 구조 3개 + 스크립트 3개" 구성
// 1분 에피소드 카드 형태의 학습 콘텐츠

export const ML02ScriptItemSchema = z.object({
  title: z
    .string()
    .min(1, "스크립트 제목은 필수입니다")
    .describe("구조별 스크립트 제목"),
  content: z
    .string()
    .min(1, "스크립트 내용은 필수입니다")
    .describe("실제发言/대사 내용"),
  duration: z
    .string()
    .regex(/^\d+~?\d*초$/, "형식: '15~20초'과 같이 입력해주세요")
    .describe("해당 스크립트 예상 길이"),
});

export type ML02ScriptItem = z.infer<typeof ML02ScriptItemSchema>;

export const ML02EpisodeCardSchema = z.object({
  episodeTitle: z
    .string()
    .min(1, "에피소드 제목은 필수입니다")
    .describe("카드 상단 에피소드 제목"),
  structure: z
    .array(z.string())
    .min(3, "구조는 최소 3개 이상이어야 합니다")
    .max(3, "구조는 최대 3개까지 가능합니다")
    .describe("도입/본론/마무리 등 3개 구조"),
  scripts: z
    .array(ML02ScriptItemSchema)
    .min(3, "스크립트는 최소 3개 이상이어야 합니다")
    .max(3, "스크립트는 최대 3개까지 가능합니다")
    .describe("각 구조별 스크립트 3개"),
  duration: z.string().default("약 1분").describe("총 에피소드 길이"),
  format: z.string().default("카드 형태").describe("출력 포맷"),
});

export type ML02EpisodeCard = z.infer<typeof ML02EpisodeCardSchema>;

// Note: JSON Schema export available via Zod's built-in .toJSON() method
// Usage: ML02EpisodeCardSchema.toJSON()