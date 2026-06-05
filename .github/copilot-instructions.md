# Copilot Instructions

## Build, test, and lint

Run all commands from `web/`:

```bash
npm install        # install dependencies
npm run dev        # start the Vite dev server
npm run build      # production build -> web/dist/
npm run lint       # ESLint across the app
npm run preview    # preview the production build locally
```

There is currently **no automated test framework configured**, so there is no full-suite or single-test command to run.

## High-level architecture

This repository is a **personal portfolio SPA** built with **React 19 + Vite** and deployed to **Azure Static Web Apps**.

- `src/main.jsx` is the bootstrap entry: it loads global CSS (`theme.css`, `index.css`, `@xyflow/react` styles) and renders `App` in `React.StrictMode`.
- `src/App.jsx` wires `react-router-dom` v6 to the centralized route table in `src/routes.jsx`. New top-level pages should be added there.
- `src/pages/` contains one route component per experience/project area. Both `src/pages/index.js` and `src/components/index.js` are barrel files and are the preferred import surface.
- Shared UI is composed from reusable primitives: `PageLayout` for the page shell, `ProjectCard` for navigation cards, `TechStackBar`/`Footer` for repeated sections, and `ZoomableImageModal` for architecture diagram lightboxes.
- `src/resume/` is a small content pipeline: Markdown files in `data/` are imported with `?raw`, parsed by `utils/parseResume.js`, and rendered by the resume template components. Update the Markdown content before changing the template.
- `public/blog/` is served as static content outside the SPA router. `staticwebapp.config.json` keeps `/blog/*` excluded from the `/index.html` fallback rewrite.

## Key conventions

- **JSX + ES modules only**: this app is plain React JSX, not TypeScript.
- **Prefer barrel imports**: import from `../components` or `../pages` instead of reaching into individual component files unless necessary.
- **Data-driven page composition**: pages like `Home.jsx` and `Microsoft.jsx` define `PROJECTS` / `TECHS` arrays near the top of the file and map them into cards or badges.
- **Chinese UI copy is intentional**: labels such as `返回`, `工作项目经历`, and project descriptions should stay consistent with the current Chinese-first presentation.
- **ProjectCard descriptions allow small HTML snippets**: many descriptions use `<br/>` inside strings and rely on `dangerouslySetInnerHTML` in `ProjectCard`. Preserve that pattern when editing card text.
- **Asset usage is import-based**: local images and diagrams are imported as modules from `img/` so Vite can bundle them correctly.
- **Resume/interview content is content-first**: edit `src/resume/data/*.md` for resume wording rather than hardcoding content into JSX.
- **Home page has a hidden navigation affordance**: tapping the title 5 times within 2 seconds reveals links to `/resume` and `/interview`.

## Deployment

- The production artifact is `web/dist/`.
- Azure Static Web Apps handles SPA fallback to `/index.html`, with `/blog/*` excluded so the static blog remains directly reachable.
