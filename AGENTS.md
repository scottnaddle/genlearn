# GenLearn - Agent Coding Guidelines

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Build / Lint / Test Commands

```bash
# Install dependencies
npm install

# Development
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Production build
npm run start        # Start production server

# Quality
npm run lint         # Run ESLint (eslint-config-next + typescript rules)
```

### Running Single Test
This project does not currently have a test suite. If adding tests, use Vitest or Jest with the following pattern:
```bash
# Vitest (recommended for Next.js)
npx vitest run src/path/to/test.spec.ts

# Jest
npx jest src/path/to/test.spec.ts
```

### Environment Variables
Create `.env.local` with:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Code Style Guidelines

### TypeScript
- **Strict mode enabled** in `tsconfig.json` — no `any` without explicit justification
- **Path alias**: Use `@/*` instead of relative paths (e.g., `@/lib/skill-registry` not `../lib/skill-registry`)
- **Type inference**: Prefer inference; explicit types for function signatures, exports, and public APIs
- **Type exports**: Use `export type { TypeName }` pattern for re-exporting types
- **Null handling**: Avoid `null`; prefer `undefined` for optional values

### Imports
```typescript
// Correct
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { executeSkill } from "@/lib/skill-registry";

// Incorrect
import NextRequest from "next/server";
```

### Naming Conventions
| Item | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `ml-01.ts`, `skill-registry.ts` |
| Types/Interfaces | PascalCase | `ContentTypeId`, `GenerateInput` |
| Functions | camelCase | `executeSkill`, `validate` |
| Constants | UPPER_SNAKE_CASE | `CONTENT_TYPE_IDS` |
| CSS Classes | kebab-case (Tailwind) | `bg-violet-500`, `text-center` |

### File Structure
```
/app                    # Next.js App Router pages/routes
  /api                  # API routes (route.ts files)
  page.tsx              # Main page component
  layout.tsx            # Root layout
  globals.css           # Global styles + Tailwind
/lib                    # Business logic (not Next.js specific)
  /schemas              # Zod schemas for content types
  skill-registry.ts     # Skill execution interface
  validator.ts          # Schema validation
```

### Component Patterns
```tsx
// Use function declaration for page/server components
export default function Home() { ... }

// Use "use client" directive for client components
"use client";

// Prop types via interface
interface ComponentProps {
  data: Record<string, unknown>;
  onSubmit: () => void;
}

// Section separators for readability
// ============================================
// Types
// ============================================
```

### Zod Schema Patterns
```typescript
// Use describe() for documentation, min() with Korean error messages
export const ML01ShortsScriptSchema = z.object({
  hook: z.string().min(1, "훅은 필수입니다").describe("시청자의 주의를 끌开场白"),
  corePoints: z.array(z.string()).min(1).max(5),
});

// Export both schema and inferred type
export type ML01ShortsScript = z.infer<typeof ML01ShortsScriptSchema>;
```

### Error Handling
```typescript
// API routes: specific error types with user-friendly Korean messages
try {
  // ...
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes("Unknown content type")) {
      return NextResponse.json({ success: false, error: "..." }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: `...: ${error.message}` }, { status: 500 });
  }
  return NextResponse.json({ success: false, error: "예기치 않은 오류" }, { status: 500 });
}

// Never swallow errors silently
// catch (e) {}  // FORBIDDEN
```

### CSS / Tailwind v4
```css
/* Use Tailwind dark mode with 'dark:' prefix */
<div className="bg-white dark:bg-slate-900">
  <p className="text-slate-700 dark:text-slate-300">

/* CSS variables via @theme inline */
@theme inline {
  --color-primary: #6366f1;
}
```

### React Patterns
```tsx
// State - prefer useState with explicit type for unions
const [contentType, setContentType] = useState<ContentTypeId>("ML-01");

// Event handlers
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // ...
};

// Conditional classes with template literals
<button className={`px-4 ${isActive ? "bg-violet-500" : "bg-slate-300"}`}>
```

---

## Adding New Content Types

1. **Create schema** in `lib/schemas/xx-xx.ts`:
   ```typescript
   import { z } from "zod";
   export const XXSchema = z.object({ ... });
   export type XX = z.infer<typeof XXSchema>;
   ```

2. **Export from** `lib/schemas/index.ts`:
   ```typescript
   export { XXSchema } from "./xx-xx";
   export type { XX } from "./xx-xx";
   ```

3. **Add to** `lib/skill-registry.ts`:
   - Create executor function
   - Add to `CONTENT_TYPE_REGISTRY`

4. **Register schema** in `lib/validator.ts`:
   ```typescript
   const SCHEMA_MAP = { "XX-01": XXSchema, ... };
   ```

5. **Update API** in `app/api/generate/route.ts`:
   - Add to `CONTENT_TYPE_IDS` tuple
   - Update request schema enum

6. **Add frontend support** in `app/page.tsx`:
   - Add to `CONTENT_TYPES` constant
   - Create view component if needed

---

## Architecture Notes

- **Skill Registry Pattern**: Content generation is abstracted via `SkillExecutor<T>` interface
- **Validation**: All outputs validated against Zod schemas before returning to client
- **Mock Data**: Current skills return realistic mock output (PoC stage)
- **Next.js 16.2.1**: Uses App Router, Server Components by default, `"use client"` for interactivity
- **Tailwind v4**: Uses `@import "tailwindcss"` (not `@tailwind base/components/utilities`)
- **Zod v4**: Current version has API differences from v3

---

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.2.1 | React framework |
| react | 19.2.4 | UI library |
| zod | ^4.3.6 | Schema validation |
| tailwindcss | ^4 | CSS framework |
| typescript | ^5 | Type safety |
| eslint | ^9 | Linting |
| eslint-config-next | 16.2.1 | Next.js ESLint config |
