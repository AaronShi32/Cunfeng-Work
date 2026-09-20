# Copilot Instructions

## Build, test, and lint

Run all commands from `web/`:

```bash
npm install        # install dependencies
npm run dev        # Vite dev server at http://localhost:5173
npm run build      # production build -> web/dist/
npm run lint       # ESLint across the app
npm run preview    # preview the production build locally
```

No automated test framework is configured.

## Architecture

This repository is a personal portfolio SPA built with React 19 and Vite 6.

- Entry flow: `index.html` -> `src/main.jsx` -> `src/App.jsx` -> `src/routes.jsx`.
- `src/routes.jsx` is the centralized route table. Add new top-level pages there.
- Routes: `/`, `/experience`, `/resume`, `/interview`, `/learn`, and `/links`.
- `App` uses `BrowserRouter` with `import.meta.env.BASE_URL`, which supports the GitHub Pages project base path.
- `src/pages/` contains route-level experiences and project pages.
- `src/components/` contains shared UI such as `PageLayout`, `ProjectCard`, `SiteTabs`, `TechStackBar`, `Footer`, and `ZoomableImageModal`.
- `src/pages/index.js` and `src/components/index.js` are the preferred import surfaces.
- Learning notes are Markdown files in `src/pages/data/` registered in `src/pages/Learn.jsx`.
- Resume and interview content flows from `src/resume/data/*.md` through `src/resume/utils/parseResume.js` into the template components. PDF export lives in `src/resume/utils/exportPdf.js`.
- `public/blog/` is static content served outside the SPA routes.

## Conventions

- Use JSX and ES modules; do not introduce TypeScript.
- Prefer barrel imports from `../components` or `../pages`.
- Keep page composition data-driven: define project and technology arrays near the top of the page and map them into components.
- Preserve the Chinese-first UI copy.
- Keep `<br/>` snippets in `ProjectCard` descriptions; the component intentionally renders them as HTML.
- Import local images and diagrams as modules from `img/` so Vite bundles them.
- Edit `src/resume/data/*.md` for resume or interview wording instead of hardcoding content in JSX.
- Use the existing CSS Modules pattern for component-scoped styles; global variables belong in `src/styles/theme.css`.
- Preserve the hidden Home navigation: tapping the title five times within two seconds reveals `/resume` and `/interview`.

## Deployment

- GitHub Actions workflow: `.github/workflows/deploy-pages.yml`.
- Production artifact: `web/dist/`.
- Production base path: `/Cunfeng-Work/`; development remains at `/`.
- The workflow copies `index.html` to `404.html` for SPA fallback.
- Static blog files remain under `/blog/*`; the workflow rewrites their absolute paths for the GitHub Pages project site.
