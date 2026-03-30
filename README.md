# GenLearn PoC

AI 기반 온디맨드 학습 콘텐츠 생성 플랫폼 PoC입니다.

**현재 PoC 상태**: ML-01(쇼츠 스크립트) + ML-05(용어 스니펫) 2개 콘텐츠 타입만 동작합니다.

---

## 🎯 개요

GenLearn은 생성형 AI를 활용하여 사용자가 선택한 형식의 학습 콘텐츠를 즉시 생성하는 플랫폼입니다.

### 현재 지원 콘텐츠 타입

| ID | 이름 | 설명 | 단계 |
|----|------|------|------|
| ML-01 | 쇼츠 스크립트 | 60~90초 분량 세로형 영상 스크립트 | PoC |
| ML-05 | 용어 스니펫 | 전문 용어 정의 + 유사어/반의어 + 예문 | PoC |

---

## 🏗️ 아키텍처

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Frontend  │────▶│   API Route  │────▶│  Skill Registry │
│  (Next.js)  │     │ /api/generate│     │ (executeSkill)  │
└─────────────┘     └──────────────┘     └─────────────────┘
                           │                      │
                           │                      ▼
                           │              ┌───────────────┐
                           │              │  Mock Skills │
                           │              │  (PoC용 더미) │
                           │              └───────────────┘
                           │                      │
                           ▼                      ▼
                    ┌──────────────┐     ┌─────────────────┐
                    │   Validator  │◀────│  생성된 Output   │
                    │  (Zod Schema)│     └─────────────────┘
                    └──────────────┘
```

### 핵심 모듈

1. **`/app/api/generate/route.ts`** - 콘텐츠 생성 API
   - 입력 검증 → 스킬 실행 → 출력 검증 → 응답 반환

2. **`/lib/skill-registry.ts`** - 스킬 레지스트리
   - 콘텐츠 타입별 스킬 실행 인터페이스
   - 현재: Mock 스킬 (나중에 실제 스킬로 교체 가능)

3. **`/lib/schemas/`** - Zod 스키마 정의
   - 각 콘텐츠 타입의 입력/출력 스키마
   - ML-01: `lib/schemas/ml-01.ts`
   - ML-05: `lib/schemas/ml-05.ts`

4. **`/lib/validator.ts`** - 스키마 검증기
   - 생성된 출력의 스키마 검증
   - 검증 결과 상세 반환

---

## 🚀 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

### 환경 변수

`.env.local` 파일을 생성하고 다음을 설정하세요:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 📡 API

### POST /api/generate

콘텐츠를 생성합니다.

**Request:**
```json
{
  "contentTypeId": "ML-01",
  "topic": "인공신경망",
  "purpose": "팀원들에게 AI 기초를 교육",
  "category": "IT",
  "level": "beginner"
}
```

**Response:**
```json
{
  "success": true,
  "contentTypeId": "ML-01",
  "output": {
    "hook": "...",
    "corePoints": ["...", "..."],
    "cta": "...",
    "duration": "60~90초",
    "platform": "tiktok"
  },
  "validation": {
    "valid": true,
    "errors": null,
    "validatedAt": "2024-01-01T00:00:00.000Z"
  },
  "generatedAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/health

서버 상태를 확인합니다.

---

## 🆕 새로운 콘텐츠 타입 추가 방법

1. **스키마 생성** (`lib/schemas/xx-xx.ts`)
   ```typescript
   import { z } from "zod";
   
   export const XXNewTypeSchema = z.object({
     // 필드 정의
   });
   
   export type XXNewType = z.infer<typeof XXNewTypeSchema>;
   ```

2. **스키마 인덱스에 추가** (`lib/schemas/index.ts`)
   ```typescript
   export { XXNewTypeSchema, XXNewType } from "./xx-xx";
   ```

3. **스킬 실행기 추가** (`lib/skill-registry.ts`)
   ```typescript
   const mockXXExecutor: SkillExecutor<XXNewType> = {
     contentTypeId: "XX-01",
     name: "새로운 콘텐츠",
     description: "설명",
     execute: async (input) => {
       // 실제 스킬 호출 로직
       return { contentTypeId: "XX-01", data: {...}, generatedAt: "..." };
     },
   };
   
   // 레지스트리에 추가
   CONTENT_TYPE_REGISTRY["XX-01"] = mockXXExecutor;
   ```

4. **스키마 맵에 추가** (`lib/validator.ts`)
   ```typescript
   import { XXNewTypeSchema } from "./schemas";
   
   const SCHEMA_MAP = {
     // 기존...
     "XX-01": XXNewTypeSchema,
   };
   ```

5. **API 라우트 요청 스키마에 추가**
   ```typescript
   const GenerateRequestSchema = z.object({
     // 기존...
     contentTypeId: z.enum(["ML-01", "ML-05", "XX-01"]), // 추가
   });
   ```

6. **프론트엔드에 선택 옵션 추가** (`app/page.tsx`)
   - CONTENT_TYPES 배열에 새 항목 추가

---

## 🔮 향후 확장

- [ ] 실제 AI 스킬 연동 (내부 프로젝트 스킬)
- [ ] 추가 콘텐츠 타입 (총 35종)
- [ ] Supabase 기반 저장소
- [ ] LMS 연동 (SCORM/xAPI)
- [ ] 멀티 테넌시 지원

---

## 📄 라이선스

Internal Use Only
