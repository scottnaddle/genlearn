/**
 * GenLearn Skill Registry
 * 
 * This module provides a unified interface for executing content generation skills.
 * Each skill handles a specific content type (e.g., ML-01, ML-05).
 * 
 * Architecture:
 * - Input: GenerateInput (topic, purpose, category, level)
 * - Skill Executor: Process the input and return raw output (JSON)
 * - Later: Replace mock executors with real skills (API calls, AI models, etc.)
 * 
 * To add a new content type:
 * 1. Create a Zod schema in lib/schemas/
 * 2. Add the skill executor in this file
 * 3. Register it in CONTENT_TYPE_REGISTRY
 */

import { ML01ShortsScript, ML01ShortsScriptSchema } from "./schemas/ml-01";
import { ML05GlossarySnippet, ML05GlossarySnippetSchema } from "./schemas/ml-05";

// ============================================
// Type Definitions
// ============================================

export interface GenerateInput {
  topic: string;
  purpose: string;
  category?: string;
  level?: "beginner" | "intermediate" | "advanced";
}

export interface GenerateOutput<T = unknown> {
  contentTypeId: string;
  data: T;
  generatedAt: string;
}

export interface SkillExecutor<T = unknown> {
  contentTypeId: string;
  name: string;
  description: string;
  execute: (input: GenerateInput) => Promise<GenerateOutput<T>>;
}

// ============================================
// Mock Skill Executors (PoC)
// ============================================

/**
 * Mock executor for ML-01 (Shorts Script)
 * Returns realistic sample output for demonstration
 */
const mockML01Executor: SkillExecutor<ML01ShortsScript> = {
  contentTypeId: "ML-01",
  name: "쇼츠 스크립트",
  description: "60~90초 분량 세로형 영상 스크립트 생성",
  execute: async (input: GenerateInput): Promise<GenerateOutput<ML01ShortsScript>> => {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock output based on input
    const mockData: ML01ShortsScript = {
      hook: `${input.topic}에 대해, 당신이 반드시 알아야 할 핵심 3가지! 📚`,
      corePoints: [
        `${input.topic}의 정의: ${input.purpose}에 핵심적인 개념입니다`,
        `${input.topic}을 활용한 실제 사례 2가지 소개`,
        `${input.level || "초급"} 수준에서 시작하는 학습 방법`,
      ],
      cta: "좋아요와 구독으로 더 많은 학습 콘텐츠를 받아보세요!",
      duration: "60~90초",
      platform: "tiktok",
    };

    return {
      contentTypeId: "ML-01",
      data: mockData,
      generatedAt: new Date().toISOString(),
    };
  },
};

/**
 * Mock executor for ML-05 (Glossary Snippet)
 * Returns realistic sample output for demonstration
 */
const mockML05Executor: SkillExecutor<ML05GlossarySnippet> = {
  contentTypeId: "ML-05",
  name: "용어 스니펫",
  description: "전문 용어 정의 + 유사어/반의어 + 예문 생성",
  execute: async (input: GenerateInput): Promise<GenerateOutput<ML05GlossarySnippet>> => {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock output based on input
    const mockData: ML05GlossarySnippet = {
      term: input.topic,
      definition: `${input.topic}은(는) ${input.purpose}를 위해 활용되는 핵심 개념으로, 
      해당 분야에서의 기본 원리와 응용 방법을 이해하는 데 필수적인 지식입니다.`,
      synonyms: [`${input.topic} 관련 용어 1`, `${input.topic} 기본 개념`],
      antonyms: [`${input.topic}의 반대에 해당하는 개념`],
      examples: [
        `예시 1: ${input.topic}를 활용하여 ${input.purpose}를 달성하는 방법`,
        `예시 2: 실무에서 ${input.topic}을 적용한 성공 사례`,
      ],
    };

    return {
      contentTypeId: "ML-05",
      data: mockData,
      generatedAt: new Date().toISOString(),
    };
  },
};

// ============================================
// Content Type Registry
// ============================================

const CONTENT_TYPE_REGISTRY: Record<string, SkillExecutor> = {
  "ML-01": mockML01Executor,
  "ML-05": mockML05Executor,
};

// ============================================
// Public API
// ============================================

/**
 * Execute a content generation skill
 * @param contentTypeId - The content type identifier (e.g., 'ML-01', 'ML-05')
 * @param input - Generation input parameters
 * @returns Generated content output
 */
export async function executeSkill<T = unknown>(
  contentTypeId: string,
  input: GenerateInput
): Promise<GenerateOutput<T>> {
  const executor = CONTENT_TYPE_REGISTRY[contentTypeId];

  if (!executor) {
    throw new Error(
      `Unknown content type: ${contentTypeId}. Available types: ${getAvailableTypes().join(", ")}`
    );
  }

  return executor.execute(input) as Promise<GenerateOutput<T>>;
}

/**
 * Get list of available content type IDs
 */
export function getAvailableTypes(): string[] {
  return Object.keys(CONTENT_TYPE_REGISTRY);
}

/**
 * Get detailed info about a specific content type
 */
export function getContentTypeInfo(contentTypeId: string): {
  contentTypeId: string;
  name: string;
  description: string;
} | null {
  const executor = CONTENT_TYPE_REGISTRY[contentTypeId];
  if (!executor) return null;

  return {
    contentTypeId: executor.contentTypeId,
    name: executor.name,
    description: executor.description,
  };
}

/**
 * Get all available content types with metadata
 */
export function getAllContentTypes(): Array<{
  contentTypeId: string;
  name: string;
  description: string;
}> {
  return Object.values(CONTENT_TYPE_REGISTRY).map((executor) => ({
    contentTypeId: executor.contentTypeId,
    name: executor.name,
    description: executor.description,
  }));
}
