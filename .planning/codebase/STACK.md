# Technology Stack

**Analysis Date:** 2026-02-02

## Languages

**Primary:**
- TypeScript 5.8.3 - Frontend application (`frontend/src/**/*.ts`, `frontend/src/**/*.tsx`)
- JavaScript (ES Modules) - Backend mock server (`backend/*.js`)

**Secondary:**
- HTML5 - Entry point and templates (`frontend/index.html`)
- CSS3/Tailwind - Styling (`frontend/src/**/*.css`, Tailwind classes)

## Runtime

**Environment:**
- Node.js 20 (specified in `netlify.toml`)
- Browser (ES2022 target)

**Package Manager:**
- npm (package-lock.json present in both frontend and backend)
- Lockfile: Present in both `frontend/` and `backend/`

## Frameworks

**Core:**
- React 19.1.1 - UI framework (`frontend/src/`)
- React Router DOM 7.9.1 - Client-side routing (`frontend/src/router.tsx`)
- Vite 7.1.2 - Build tool and dev server (`frontend/vite.config.ts`)

**Testing:**
- Playwright 1.57.0 - E2E testing (`frontend/playwright.config.ts`)

**Build/Dev:**
- Vite 7.1.2 - Development server with HMR, production bundler
- TypeScript 5.8.3 - Type checking and compilation
- ESLint 9.33.0 - Linting with TypeScript and React plugins
- PostCSS 8.5.6 - CSS processing
- Autoprefixer 10.4.21 - CSS vendor prefixing

## Key Dependencies

**Critical:**
- axios 1.13.0 - HTTP client for API communication (`frontend/src/services/api/client.ts`)
- react-router-dom 7.9.1 - SPA routing and navigation
- Tailwind CSS 3.4.17 - Utility-first CSS framework

**UI/UX:**
- lucide-react 0.544.0 - Icon library
- react-markdown 10.1.0 - Markdown rendering

**Backend (Mock Server):**
- json-server 0.17.4 - Mock REST API server
- dotenv 16.3.1 - Environment variable management
- express (via json-server) - HTTP server

## Configuration

**Environment Variables:**

Frontend (Vite):
- `VITE_API_URL` - Backend API URL (default: `http://localhost:8000`)
- `VITE_WS_URL` - WebSocket URL (default: `ws://localhost:8000/ws`)
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `VITE_TOKEN_STORAGE_KEY` - localStorage key for access token
- `VITE_REFRESH_TOKEN_KEY` - localStorage key for refresh token
- `VITE_USER_STORAGE_KEY` - localStorage key for user data
- `VITE_ENABLE_WEBSOCKET` - Enable/disable WebSocket features
- `VITE_WS_RECONNECT_INTERVAL` - WebSocket reconnect interval (ms)
- `VITE_WS_MAX_RECONNECT_ATTEMPTS` - Max reconnect attempts

Backend (Mock):
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `GEMINI_API_KEY` - Google Gemini API key (alternative)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode
- `DB_PATH` - Path to JSON database
- `AI_ENABLED` - Enable AI features
- `FALLBACK_TO_RULES` - Use rule-based fallback
- `CONFIDENCE_THRESHOLD` - AI confidence threshold

**Build Configuration:**
- `frontend/vite.config.ts` - Vite build and dev server config
- `frontend/tsconfig.json` - TypeScript project references
- `frontend/tsconfig.app.json` - App-specific TypeScript config (ES2022, strict mode)
- `frontend/tailwind.config.js` - Tailwind CSS with custom theme (Enchanted Forest)
- `frontend/postcss.config.js` - PostCSS with Tailwind and Autoprefixer
- `frontend/eslint.config.js` - ESLint flat config with TypeScript

## TypeScript Configuration

**Compiler Options:**
- Target: ES2022
- Module: ESNext with bundler resolution
- JSX: react-jsx
- Strict mode: Enabled
- No emit (Vite handles bundling)

**Key Settings (`frontend/tsconfig.app.json`):**
```json
{
  "target": "ES2022",
  "module": "ESNext",
  "moduleResolution": "bundler",
  "jsx": "react-jsx",
  "strict": true,
  "verbatimModuleSyntax": true
}
```

## Tailwind Theme

**Custom Colors (Forest Theme):**
- Primary: `#1E4F2A` (Forest Green)
- Secondary: `#3A7D44` (Medium Green)
- Accent Gold: `#FDC500`
- Dark mode: Custom high-contrast palette

**Fonts:**
- Sans: Inter
- Heading: Poppins

## Platform Requirements

**Development:**
- Node.js 20+
- npm
- Modern browser (ES2022 support)

**Production:**
- Netlify (frontend hosting)
- Backend: Separate deployment (api.tajiconnect.com)
- Node.js 20 runtime

## Scripts

**Frontend (`frontend/package.json`):**
```bash
npm run dev      # Vite dev server (port 5173)
npm run build    # TypeScript compile + Vite build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

**Backend (`backend/package.json`):**
```bash
npm run dev      # json-server with hot reload
npm run start    # Production server
npm run test     # Run AI algorithm tests
npm run setup    # Initial database setup
```

---

*Stack analysis: 2026-02-02*
