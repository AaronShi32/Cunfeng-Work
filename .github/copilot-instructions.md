# Copilot Instructions

## Build & Run

All commands run from the `web/` directory:

```bash
npm install        # install dependencies
npm run dev        # local dev server (Vite)
npm run build      # production build → web/dist/
npm run lint       # ESLint (flat config, React hooks + React Refresh)
npm run preview    # preview production build locally
```

No test framework is configured.

## Architecture

This is a **personal portfolio SPA** built with React 19 + Vite, deployed to **Azure Static Web Apps**.

### Routing & Pages

- `src/routes.jsx` — central route table (array of `{ path, element }` objects consumed by `App.jsx` via `react-router-dom` v6)
- `src/pages/` — one component per route (Home, Microsoft, Alibaba, ENI, InstanceMigration, ASI)
- `src/resume/` — resume/interview feature: Markdown files in `data/`, parsed by `utils/parseResume.js`, rendered via `templates/ClassicTemplate.jsx`
- Pages re-exported through barrel files (`pages/index.js`, `components/index.js`)

### Components

- `PageLayout` — shared page shell (dark gradient background, optional back button, title/subtitle)
- `ProjectCard` — card linking to a route or triggering an onClick (supports logo image or emoji icon)
- `ZoomableImageModal` — lightbox for architecture diagrams stored in `img/`
- `TechStackBar` / `Footer` / `LinkButton` — reusable UI primitives

### Styling

- **CSS Modules** (`*.module.css`) for component-scoped styles in `src/styles/`
- **CSS custom properties** defined in `src/styles/theme.css` (colors, spacing, typography, responsive breakpoints at 768px)
- No CSS framework — all styles are hand-written

### Static Content

- `img/` — architecture diagram PNGs/SVGs organized by project (ASI, FCS, HDI, Scout, Fabric, Others)
- `public/blog/` — static blog files served outside the SPA (excluded from SPA fallback in `staticwebapp.config.json`)

## Key Conventions

- **JSX only** — no TypeScript; all components are `.jsx` files with ES modules (`"type": "module"`)
- **Barrel exports** — `components/index.js` and `pages/index.js` re-export all modules; import from the barrel, not individual files
- **Data-driven pages** — project lists are defined as const arrays (e.g., `PROJECTS`, `TECHS`) at the top of page components, then mapped to `ProjectCard` elements
- **Chinese UI text** — user-facing labels are in Chinese (e.g., "返回", "工作项目经历"); keep this consistent
- **Resume from Markdown** — resume content lives in `src/resume/data/*.md` and is parsed into structured data; edit the Markdown, not the template, to update resume content
- **Image imports** — architecture images are imported as ES modules (Vite handles bundling), not referenced by public URL
- **Hidden menu** — Home page has a secret 5-tap menu (tap title 5× within 2s) for accessing `/resume` and `/interview` routes

## Deployment

- CI/CD via GitHub Actions → Azure Static Web Apps (`azure-static-web-apps-deploy@v1`)
- Build output: `web/dist/`
- SPA fallback rewrites to `/index.html`, except `/blog/*` paths
