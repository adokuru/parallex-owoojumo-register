# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

- Repo type: Next.js 15 (App Router) with TypeScript and Tailwind CSS v4
- Package manager: Any (npm/yarn/pnpm/bun). A bun.lock is present, so bun is supported/preferred.

Commands you’ll commonly use
- Install dependencies
  - bun: bun install
  - npm: npm install
  - pnpm: pnpm install
  - yarn: yarn
- Development server
  - bun dev, or npm run dev, pnpm dev, yarn dev
  - Opens http://localhost:3000 (see README.md)
- Build
  - bun run build, or npm run build, pnpm build, yarn build
- Start (after build)
  - bun run start, or npm run start, pnpm start, yarn start
- Lint
  - bun run lint, or npm run lint, pnpm lint, yarn lint

Notes on running a single test
- There is currently no test setup in this repository (no Jest/Vitest config or test scripts). If you add tests later, document the exact commands here.

Project architecture (big picture)
- App Router (src/app)
  - src/app/layout.tsx defines the root HTML structure and loads global styles (src/app/globals.css) and the Geist fonts via next/font.
  - src/app/page.tsx is the default homepage. To add routes, create directories under src/app (e.g., src/app/register/page.tsx becomes /register).
- Styling (Tailwind CSS v4)
  - Tailwind v4 is enabled via postcss.config.mjs with the plugin "@tailwindcss/postcss" and globals.css imports tailwind using @import "tailwindcss".
  - The theme tokens (fonts/colors) are defined inline in src/app/globals.css using the new @theme syntax and custom CSS variables.
- TypeScript configuration
  - tsconfig.json: strict on, moduleResolution "bundler", path alias @/* -> ./src/* for cleaner imports.
- Linting
  - ESLint flat config in eslint.config.mjs extending Next presets (next/core-web-vitals and next/typescript). Node_modules, .next, out, build are ignored.
- Next.js config
  - next.config.ts is currently minimal with default options.
- Public assets
  - Static assets live under public/ and are served at the root path (e.g., /next.svg).

Important bits from README.md
- Development: use the dev script (npm/yarn/pnpm/bun) and open http://localhost:3000. Edit src/app/page.tsx and the page hot-reloads.
- Deployment: the template suggests Vercel; refer to Next.js docs for deployment if/when you add hosting.

Common development tasks in this repo
- Create a new page/route
  - Add a folder with page.tsx under src/app. Example: src/app/register/page.tsx -> route path /register.
- Add API routes (if needed)
  - Use Route Handlers under src/app/api/<route>/route.ts for server-side logic and proxying. None exist yet; add as needed.
- Use path alias
  - Import local files using @/..., which maps to src/.

Conventions and tips specific to this repo
- Scripts use --turbopack for dev and build to speed up recompilation.
- Tailwind v4 uses the new plugin via PostCSS; keep your styles in src/app/globals.css or add component-level classes.
- Keep new components/pages co-located under src/app using the App Router patterns rather than adding a legacy pages/ directory.

