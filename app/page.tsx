"use client";

import { useState } from "react";

// ============================================
// Types
// ============================================

type ContentTypeId = "ML-01" | "ML-02" | "ML-05" | "VI-01";
type Level = "beginner" | "intermediate" | "advanced";
type Tab = "formatted" | "json" | "validation";

interface GenerateResponse {
  success: boolean;
  contentTypeId: string;
  input: {
    topic: string;
    purpose: string;
    category?: string;
    level?: string;
  };
  output: Record<string, unknown>;
  validation: {
    valid: boolean;
    errors?: string[];
    validatedAt: string;
  };
  generatedAt: string;
}

// ============================================
// Constants
// ============================================

const CONTENT_TYPES = [
  {
    id: "ML-01" as ContentTypeId,
    name: "쇼츠 스크립트",
    description: "60~90초 분량 세로형 영상 스크립트",
    icon: "🎬",
    details: ["훅 → 핵심 포인트 3개 → CTA 구조", "TikTok · Instagram Reels · YouTube Shorts"],
  },
  {
    id: "ML-02" as ContentTypeId,
    name: "1분 에피소드 카드",
    description: "구조화된 학습 카드",
    icon: "📇",
    details: ["제목 + 구조 3개", "스크립트 3개"],
  },
  {
    id: "ML-05" as ContentTypeId,
    name: "용어 스니펫",
    description: "전문 용어 정의 + 유사어/반의어 + 예문",
    icon: "📝",
    details: ["용어 정의 + 유사어/반의어", "실사용 예문 1~2문장"],
  },
  {
    id: "VI-01" as ContentTypeId,
    name: "인포그래픽",
    description: "SVG 기반 정보 그래픽",
    icon: "📊",
    details: ["시각적 데이터", "차트 포함"],
  },
];

const LEVELS: { value: Level; label: string }[] = [
  { value: "beginner", label: "초급" },
  { value: "intermediate", label: "중급" },
  { value: "advanced", label: "고급" },
];

// ============================================
// Components
// ============================================

function ValidationBadge({ valid, errors }: { valid: boolean; errors?: string[] }) {
  return (
    <div className={`rounded-lg p-3 ${valid ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
      <div className="flex items-center gap-2">
        {valid ? (
          <>
            <span className="text-emerald-500 text-xl">✓</span>
            <span className="font-medium text-emerald-700">스키마 검증 통과</span>
          </>
        ) : (
          <>
            <span className="text-red-500 text-xl">✗</span>
            <span className="font-medium text-red-700">스키마 검증 실패</span>
          </>
        )}
      </div>
      {errors && errors.length > 0 && (
        <ul className="mt-2 text-sm text-red-600 space-y-1">
          {errors.map((err, i) => (
            <li key={i}>• {err}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ShortsScriptView({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      {/* Hook */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl p-4">
        <div className="text-xs font-medium opacity-80 mb-1">🎯 HOOK (오프닝)</div>
        <div className="text-lg font-semibold">{data.hook as string}</div>
      </div>

      {/* Core Points */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
        <div className="text-xs font-medium text-slate-500 mb-3">📚 핵심 포인트</div>
        <ul className="space-y-2">
          {(data.corePoints as string[] | undefined)?.map((point, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-300 rounded-full flex items-center justify-center text-sm font-medium">
                {i + 1}
              </span>
              <span className="text-slate-700 dark:text-slate-300">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="text-xs font-medium text-amber-600 mb-1">📢 CTA (콜투액션)</div>
        <div className="text-amber-800 dark:text-amber-200">{data.cta as string}</div>
      </div>

      {/* Meta */}
      <div className="flex gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-1">
          <span>⏱️</span>
          <span>{data.duration as string}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>📱</span>
          <span className="capitalize">{data.platform as string}</span>
        </div>
      </div>
    </div>
  );
}

function GlossarySnippetView({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      {/* Term Card */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl p-5">
        <div className="text-xs font-medium opacity-80 mb-2">용어</div>
        <div className="text-2xl font-bold mb-4">{data.term as string}</div>
        <div className="text-sm opacity-90 leading-relaxed">{data.definition as string}</div>
      </div>

      {/* Synonyms & Antonyms */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-3">
          <div className="text-xs font-medium text-purple-600 mb-2">🔄 유사어</div>
          <div className="space-y-1">
            {(data.synonyms as string[] | undefined)?.map((s, i) => (
              <div key={i} className="text-sm text-purple-700 dark:text-purple-300">{s}</div>
            ))}
          </div>
        </div>
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl p-3">
          <div className="text-xs font-medium text-rose-600 mb-2">🔄 반의어</div>
          <div className="space-y-1">
            {(data.antonyms as string[] | undefined)?.map((a, i) => (
              <div key={i} className="text-sm text-rose-700 dark:text-rose-300">{a}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
        <div className="text-xs font-medium text-slate-500 mb-3">💡 예시</div>
        <ul className="space-y-2">
          {(data.examples as string[] | undefined)?.map((ex, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
              <span className="text-violet-500">•</span>
              <span>{ex}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ML02EpisodeCardView({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      {/* Episode Title */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl p-4">
        <div className="text-xs font-medium opacity-80 mb-1">📇 EPISODE CARD</div>
        <div className="text-xl font-bold">{data.episodeTitle as string}</div>
        <div className="flex gap-4 mt-2 text-sm opacity-90">
          <span>⏱️ {data.duration as string}</span>
          <span>📋 {data.format as string}</span>
        </div>
      </div>

      {/* Structure + Scripts */}
      <div className="space-y-3">
        {(data.structure as string[] | undefined)?.map((struct, i) => {
          const script = (data.scripts as Array<Record<string, unknown>> | undefined)?.[i];
          return (
            <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 rounded-full flex items-center justify-center text-sm font-medium">
                  {i + 1}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{struct}</span>
                {script && (
                  <span className="text-xs text-slate-500 ml-auto">⏱️ {script.duration as string}</span>
                )}
              </div>
              {script && (
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pl-8">
                  {script.content as string}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VI01InfographicView({ data }: { data: Record<string, unknown> }) {
  const title = data.title as string;
  const source = data.source as string | undefined;
  const sections = data.sections as Array<Record<string, unknown>> | undefined;
  const svgData = data.svgData as string | undefined;

  const renderedSections: React.ReactNode = sections
    ? sections.map((section, i) => {
        const sectionTitle = String(section.title ?? "");
        const sectionContent = String(section.content ?? "");
        const chartType = String(section.chartType ?? "none");
        const chartData = (section.chartData as Array<{label: string; value: number; color?: string}> | undefined) ?? undefined;

        return (
          <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300 rounded flex items-center justify-center text-xs font-medium">
                {i + 1}
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {sectionTitle}
              </span>
              <span className="text-xs text-slate-400 ml-auto uppercase">{chartType}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">{sectionContent}</p>
            {chartType !== "none" && chartData && (
              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500 mb-2">차트 데이터</div>
                <div className="space-y-1">
                  {chartData.map((item, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color || "#8B5CF6" }} />
                      <span className="text-xs text-slate-600 dark:text-slate-400">{item.label}</span>
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200 ml-auto">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })
    : null;

  return (
    <>
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl p-4">
        <div className="text-xs font-medium opacity-80 mb-1">📊 INFOGRAPHIC</div>
        <div className="text-xl font-bold">{title}</div>
        {source && <div className="text-xs opacity-70 mt-1">출처: {source}</div>}
      </div>
      <div className="space-y-4">{renderedSections}</div>
      {svgData && (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-500 mb-3">SVG 미리보기</div>
          <div className="bg-white rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div dangerouslySetInnerHTML={{ __html: svgData }} />
          </div>
        </div>
      )}
    </>
  );
}

// ============================================
// Main Page
// ============================================

export default function Home() {
  // Form state
  const [topic, setTopic] = useState("");
  const [purpose, setPurpose] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState<Level>("beginner");
  const [contentType, setContentType] = useState<ContentTypeId>("ML-01");

  // Response state
  const [response, setResponse] = useState<GenerateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<Tab>("formatted");

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentTypeId: contentType,
          topic,
          purpose,
          category: category || undefined,
          level,
        }),
      });

      const data: GenerateResponse = await res.json();
      setResponse(data);
      setActiveTab("formatted");
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = topic.trim().length > 0 && purpose.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-violet-500/25">
              G
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 dark:text-white">GenLearn</h1>
              <p className="text-xs text-slate-500">AI 기반 학습 콘텐츠 생성 PoC</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300 text-xs font-medium rounded-md">
              ML-01 · ML-02 · ML-05 · VI-01
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Form */}
          <div className="space-y-6">
            {/* Step 1: Input */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 bg-violet-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <h2 className="font-semibold text-slate-900 dark:text-white">주제 입력</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    주제 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="예: 인공신경망, CRISPR 유전자 편집"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    학습 목적 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="예: 팀원들에게AI 기초를 빠르게 교육하고 싶습니다"
                    rows={2}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      분야
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="예: IT, 금융"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      난이도
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as Level)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition cursor-pointer"
                    >
                      {LEVELS.map((l) => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Content Type */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 bg-violet-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <h2 className="font-semibold text-slate-900 dark:text-white">콘텐츠 타입 선택</h2>
              </div>

              <div className="space-y-3">
                {CONTENT_TYPES.map((ct) => (
                  <label
                    key={ct.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      contentType === ct.id
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="contentType"
                      value={ct.id}
                      checked={contentType === ct.id}
                      onChange={(e) => setContentType(e.target.value as ContentTypeId)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{ct.icon}</span>
                        <span className="font-medium text-slate-900 dark:text-white">{ct.name}</span>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs rounded-md font-mono">
                          {ct.id}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{ct.description}</p>
                      <ul className="mt-2 space-y-0.5">
                        {ct.details.map((d, i) => (
                          <li key={i} className="text-xs text-slate-400">• {d}</li>
                        ))}
                      </ul>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 3: Generate */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                isFormValid && !isLoading
                  ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 active:scale-[0.98]"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  생성 중...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  ✨ AI로 콘텐츠 생성하기
                </span>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                오류: {error}
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="space-y-4">
            {response ? (
              <>
                {/* Validation Badge */}
                <ValidationBadge
                  valid={response.validation.valid}
                  errors={response.validation.errors}
                />

                {/* Tabs */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="flex border-b border-slate-200 dark:border-slate-700">
                    {(["formatted", "json", "validation"] as Tab[]).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                          activeTab === tab
                            ? "text-violet-600 dark:text-violet-400 border-b-2 border-violet-500 bg-violet-50/50 dark:bg-violet-950/30"
                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                        }`}
                      >
                        {tab === "formatted" ? "📄 포맷tted 텍스트" : tab === "json" ? "🔧 Raw JSON" : "✅ 검증 상세"}
                      </button>
                    ))}
                  </div>

                  <div className="p-6">
                    {activeTab === "formatted" && (
                      <div className="animate-in fade-in duration-200">
                        {contentType === "ML-01" ? (
                          <ShortsScriptView data={response.output} />
                        ) : contentType === "ML-05" ? (
                          <GlossarySnippetView data={response.output} />
                        ) : contentType === "ML-02" ? (
                          <ML02EpisodeCardView data={response.output} />
                        ) : contentType === "VI-01" ? (
                          <VI01InfographicView data={response.output} />
                        ) : null}
                      </div>
                    )}

                    {activeTab === "json" && (
                      <div className="animate-in fade-in duration-200">
                        <pre className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 overflow-x-auto text-xs font-mono text-slate-700 dark:text-slate-300 max-h-96 overflow-y-auto">
                          {JSON.stringify(response.output, null, 2)}
                        </pre>
                      </div>
                    )}

                    {activeTab === "validation" && (
                      <div className="animate-in fade-in duration-200 space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4">
                          <div className="text-xs font-medium text-slate-500 mb-2">검증 결과</div>
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">스키마 검증</span>
                              <span className={response.validation.valid ? "text-emerald-600" : "text-red-600"}>
                                {response.validation.valid ? "✓ 통과" : "✗ 실패"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">콘텐츠 타입</span>
                              <span className="text-slate-900 dark:text-white font-mono">{response.contentTypeId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">생성 시각</span>
                              <span className="text-slate-700 dark:text-slate-300 text-xs">
                                {new Date(response.generatedAt).toLocaleString("ko-KR")}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">검증 시각</span>
                              <span className="text-slate-700 dark:text-slate-300 text-xs">
                                {new Date(response.validation.validatedAt).toLocaleString("ko-KR")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {response.validation.errors && response.validation.errors.length > 0 && (
                          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
                            <div className="text-xs font-medium text-red-600 mb-2">오류 상세</div>
                            <ul className="space-y-1">
                              {response.validation.errors.map((err, i) => (
                                <li key={i} className="text-sm text-red-700 dark:text-red-300">• {err}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4">
                          <div className="text-xs font-medium text-slate-500 mb-2">입력 파라미터</div>
                          <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
                            {JSON.stringify(response.input, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                  아직 생성된 콘텐츠가 없습니다
                </h3>
                <p className="text-sm text-slate-500">
                  좌측 폼에 주제를 입력하고<br />콘텐츠 타입을 선택한 후<br />생성 버튼을 클릭하세요
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-12 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-slate-500">
          GenLearn PoC · ML-01 & ML-02 & ML-05 & VI-01 Demo · 스키마 검증 포함
        </div>
      </footer>
    </div>
  );
}
