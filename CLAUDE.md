# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

All commands run from `web/`:

```bash
npm install        # install dependencies
npm run dev        # Vite dev server at http://localhost:5173
npm run build      # production build → web/dist/
npm run lint       # ESLint
npm run preview    # preview production build locally
```

No automated test framework is configured.

## Architecture

This is a **React 19 + Vite 6 SPA** (personal portfolio) deployed to **Azure Static Web Apps**.

**Entry flow**: `index.html` → `src/main.jsx` (loads global CSS, renders App in StrictMode) → `src/App.jsx` (react-router-dom v6) → `src/routes.jsx` (centralized route table — add new pages here).

**Routes**:
- `/` — Home (hidden menu: tap title 5× in 2s reveals `/resume` and `/interview` links)
- `/experience` — Microsoft & Alibaba project showcase
- `/resume` — Resume renderer (markdown → parsed structure → A4 template → PDF export)
- `/interview` — Interview prep Q&A
- `/learn` — Placeholder
- `/links` — Social links
- `/blog/*` — Static blog served outside SPA (excluded from fallback rewrite in `staticwebapp.config.json`)

**Component hierarchy**: `App` → `PageLayout` (shell with `SiteTabs` navigation + optional back button) → page content.

**Resume pipeline**: Markdown in `src/resume/data/*.md` → imported with `?raw` → parsed by `utils/parseResume.js` → rendered by `templates/ClassicTemplate.jsx` → exportable to PDF via `utils/exportPdf.js`. Edit the markdown files for content changes, not the JSX.

**Barrel exports**: `src/pages/index.js` and `src/components/index.js` — always import from these rather than individual files.

## Key Conventions

- **JSX + ES modules only** — no TypeScript.
- **Chinese UI copy is intentional** — labels like `返回`, `工作项目经历` should stay Chinese.
- **Data-driven pages** — pages define arrays (`MS_PROJECTS`, `ALI_PROJECTS`, `TECHS`) near the top and map them into card/badge components.
- **ProjectCard descriptions use HTML snippets** — strings contain `<br/>` tags rendered via `dangerouslySetInnerHTML`. Preserve this pattern.
- **Assets are imported as modules** — images from `img/` are ES-imported so Vite bundles them. Use `import img from '../../img/...'`, not public URLs.
- **CSS Modules for scoping** — each component has a `.module.css` file. Global theme variables live in `src/styles/theme.css`.

## Deployment

- CI: GitHub Actions (`.github/workflows/`) → Azure Static Web Apps
- Build artifact: `web/dist/`
- SPA fallback rewrites to `/index.html`, except `/blog/*` (static content served directly)
