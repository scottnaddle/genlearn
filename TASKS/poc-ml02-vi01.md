# GenLearn PoC: ML-02 + VI-01 추가 개발

## 작업 개요
- 기존 ML-01, ML-05基础上 PoC 용으로 ML-02, VI-01 스키마/스킬/UI 추가
- SQLite (Drizzle ORM) 연동 준비
- opencode가 전체 개발 진행 (설계, 코딩, 테스트)

## 현재 상태
- 프로젝트 경로: /root/genlearn
- 기존 스키마: ML-01 (쇼츠 스크립트), ML-05 (용어 스니펫)
- 기존 구조: lib/schemas/, lib/skill-registry.ts, app/api/generate/route.ts, app/page.tsx

## 개발할 2개 콘텐츠 타입

### 1. ML-02 (1분 에피소드 카드)
- PRD: "1분 에피소드" - 하나의 주제!구조!스크립트 3개로 구성
- 스크립트 내용: 제목/구조/스크립트 포함
- 출력: JSON 카드 형식

### 2. VI-01 (인포그래픽)
- PRD: "정보 그래픽" - 하나의 주제에 SVG 데이터를带了
- 출력: SVG 코드 + JSON 메타데이터
- Chart.js 또는 Mermaid 사용

## 작업 단계

### Phase 1: 스키마 생성
1. `/root/genlearn/lib/schemas/ml-02.ts` 생성
   - Zod 스키마: episodeTitle, structure, scripts (3개)
   - type export

2. `/root/genlearn/lib/schemas/vi-01.ts` 생성
   - Zod 스키마: title, sections[], svgData, chartType, source
   - type export

3. `/root/genlearn/lib/schemas/index.ts` 업데이트
   - ML02, VI01 export 추가

### Phase 2: Skill Registry 업데이트
4. `/root/genlearn/lib/skill-registry.ts` 업데이트
   - mockML02Executor 추가
   - mockVI01Executor 추가
   - CONTENT_TYPE_REGISTRY에 "ML-02", "VI-01" 추가

### Phase 3: API 라우트 업데이트
5. `/root/genlearn/app/api/generate/route.ts` 업데이트
   - CONTENT_TYPE_IDS에 "ML-02", "VI-01" 추가
   - GenerateRequestSchema 업데이트

### Phase 4: 프론트엔드 UI 추가
6. `/root/genlearn/app/page.tsx` 업데이트
   - CONTENT_TYPES 배열에 ML-02, VI-01 추가
   - ML02EpisodeCardView 컴포넌트 추가
   - VI01InfographicView 컴포넌트 추가
   - 타입 업데이트: ContentTypeId = "ML-01" | "ML-02" | "ML-05" | "VI-01"

### Phase 5: SQLite + Drizzle 연동
7. `/root/genlearn`에 Drizzle ORM 설치
   - npm install drizzle-orm better-sqlite3
   - npm install -D drizzle-kit @types/better-sqlite3

8. `/root/genlearn/lib/db/schema.ts` 생성
   - contents table (id, content_type, input, output, created_at)
   - generations table (id, content_id, model, tokens, duration)

9. `/root/genlearn/lib/db/index.ts` 생성
   - DB client export

10. `/root/genlearn/drizzle.config.ts` 생성

### Phase 6: 문서 업데이트
11. `/root/genlearn/AGENTS.md` 업데이트
    - ML-02, VI-01 추가
    - SQLite/Drizzle 추가

### Phase 7: GitHub Commit
12. 모든 변경사항 git add + commit
    - commit message: "feat: add ML-02 and VI-01 content types with SQLite/Drizzle"
    - git push

## 검증
- `npm run lint` 성공 확인
- `npm run build` 성공 확인 (optional)
- API 테스트: ML-02, VI-01 generation 확인

## 규칙
- Zod v4 API 사용 (z.object, z.infer)
- TypeScript strict mode
- 한국어 에러 메시지 사용
- AGENTS.md의 코딩 가이드라인 따르기