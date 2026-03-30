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
import { ML02EpisodeCard } from "./schemas/ml-02";
import { VI01Infographic } from "./schemas/vi-01";

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

/**
 * Mock executor for ML-02 (Episode Card)
 * Returns realistic sample output for demonstration
 */
const mockML02Executor: SkillExecutor<ML02EpisodeCard> = {
  contentTypeId: "ML-02",
  name: "1분 에피소드 카드",
  description: "구조화된 학습 카드 - 제목 + 구조 3개 + 스크립트 3개",
  execute: async (input: GenerateInput): Promise<GenerateOutput<ML02EpisodeCard>> => {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock output based on input
    const mockData: ML02EpisodeCard = {
      episodeTitle: `${input.topic} 완전 정복`,
      structure: ["도입", "본론", "마무리"],
      scripts: [
        {
          title: "도입",
          content: `${input.topic}에 대해 궁금하시나요? 지금부터 ${input.purpose}를 위한 핵심 내용을 알려드리겠습니다!`,
          duration: "15~20초",
        },
        {
          title: "본론",
          content: `${input.topic}의 핵심: ${input.level || "초급"} 수준에서 알아야 할 3가지 포인트! 첫째, 기본 개념부터 시작해서...\n둘째, 실제 활용 사례를 통해...\n셋째, 학습 방법을 정리하면...`,
          duration: "35~40초",
        },
        {
          title: "마무리",
          content: `오늘 배운 ${input.topic}, 간단히 정리하면 이렇습니다. 더 깊이 알고 싶으시면 관련 콘텐츠를 확인해주세요!`,
          duration: "10~15초",
        },
      ],
      duration: "약 1분",
      format: "카드 형태",
    };

    return {
      contentTypeId: "ML-02",
      data: mockData,
      generatedAt: new Date().toISOString(),
    };
  },
};

/**
 * Mock executor for VI-01 (Infographic)
 * Returns realistic sample output for demonstration
 */
const mockVI01Executor: SkillExecutor<VI01Infographic> = {
  contentTypeId: "VI-01",
  name: "인포그래픽",
  description: "SVG 기반 정보 그래픽 - 시각적 데이터 표현",
  execute: async (input: GenerateInput): Promise<GenerateOutput<VI01Infographic>> => {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock output based on input
    const mockData: VI01Infographic = {
      title: `${input.topic} 정보 그래픽`,
      sections: [
        {
          title: "핵심 개념",
          content: `${input.topic}은 ${input.purpose}에 핵심적인 역할을 합니다. 주요 특성과 활용 방법을 시각적으로 정리한 인포그래픽입니다.`,
          chartType: "none",
        },
        {
          title: "분포 현황",
          content: "주요 요소별 분포 비율",
          chartType: "pie",
          chartData: [
            { label: "기본 개념", value: 40, color: "#8B5CF6" },
            { label: "실무 적용", value: 35, color: "#06B6D4" },
            { label: "심화 학습", value: 25, color: "#F59E0B" },
          ],
        },
        {
          title: "학습 로드맵",
          content: "단계별 학습 프로세스",
          chartType: "bar",
          chartData: [
            { label: "1단계", value: 100, color: "#8B5CF6" },
            { label: "2단계", value: 75, color: "#06B6D4" },
            { label: "3단계", value: 50, color: "#10B981" },
            { label: "4단계", value: 25, color: "#F59E0B" },
          ],
        },
      ],
      svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#F8FAFC"/>
        <text x="200" y="30" font-size="16" font-weight="bold" text-anchor="middle" fill="#1E293B">${input.topic}</text>
        <circle cx="200" cy="150" r="80" fill="none" stroke="#8B5CF6" stroke-width="20" stroke-dasharray="201 502"/>
        <text x="200" y="155" font-size="12" text-anchor="middle" fill="#1E293B">40%</text>
      </svg>`,
      source: `GenLearn AI 생성 (${input.level || "초급"} 수준)`,
      chartType: "mixed",
    };

    return {
      contentTypeId: "VI-01",
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
  "ML-02": mockML02Executor,
  "VI-01": mockVI01Executor,
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
