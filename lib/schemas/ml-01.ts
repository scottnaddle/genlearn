import { z } from "zod";

// ML-01: Shorts Script Schema
// 60~90초 분량 세로형 영상 스크립트. 훅 → 핵심 포인트 3개 → CTA 구조.
export const ML01ShortsScriptSchema = z.object({
  hook: z
    .string()
    .min(1, "훅은 필수입니다")
    .describe("시청자의 주의를 끌开场白 (3~5초)"),
  corePoints: z
    .array(z.string())
    .min(1, "핵심 포인트는 최소 1개 이상이어야 합니다")
    .max(5, "핵심 포인트는 최대 5개까지 가능합니다")
    .describe("영상에서 전달할 핵심 내용 1~5개"),
  cta: z.string().min(1, "CTA(Call-to-Action)는 필수입니다").describe("영상이 끝나기 전 행동 유도 문구"),
  duration: z
    .string()
    .regex(/^\d+~\d+초$/, "형식: '60~90초'과 같이 입력해주세요")
    .describe("예상 영상 길이"),
  platform: z
    .enum(["tiktok", "instagram", "youtube"])
    .describe("타겟 플랫폼"),
});

export type ML01ShortsScript = z.infer<typeof ML01ShortsScriptSchema>;

// Note: JSON Schema export available via Zod's built-in .toJSON() method
// Usage: ML01ShortsScriptSchema.toJSON()
