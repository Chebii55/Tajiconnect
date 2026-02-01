# External Integrations

**Analysis Date:** 2026-02-02

## APIs & External Services

**Production Backend API:**
- URL: `https://api.tajiconnect.com`
- Architecture: Microservices via API Gateway
- Auth: JWT Bearer tokens
- Client: `frontend/src/services/api/client.ts`

**API Gateway Endpoints (`frontend/src/services/api/endpoints.ts`):**
- User Service: `/api/v1/users/*`, `/api/v1/auth/*`, `/api/v1/onboarding/*`, `/api/v1/admin/*`
- Course Service: `/api/v1/courses/*`, `/api/v1/grades/*`, `/api/v1/subjects/*`
- Content Service: `/api/v1/content/*`
- Notification Service: `/api/v1/notifications/*`
- Payment Service: `/api/v1/payments/*`, `/api/v1/subscriptions/*`
- AI Service: `/api/v1/ai/*`, `/api/v1/psychometric/*`, `/api/v1/learning-paths/*`, `/api/v1/skills/*`
- Analytics Service: `/api/v1/analytics/*`
- Gateway: `/api/v1/gateway/*`

**AI/ML Services (Backend Integration):**
- OpenAI GPT-3.5 Turbo - Career recommendations, roadmap generation
  - Integration: `backend/career-algorithm.js` (lines 216-247)
  - Auth: `OPENAI_API_KEY` environment variable
  - Endpoint: `https://api.openai.com/v1/chat/completions`

- Google Gemini Pro - Alternative AI provider
  - Integration: `backend/career-algorithm.js` (lines 249-276)
  - Auth: `GEMINI_API_KEY` environment variable
  - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`

## Authentication & Identity

**JWT Authentication:**
- Implementation: Custom via `frontend/src/services/api/auth.ts`
- Token storage: localStorage (access_token, refresh_token)
- Auto-refresh: `frontend/src/services/api/client.ts` (interceptor)
- Token refresh endpoint: `/api/v1/auth/refresh`

**Google OAuth 2.0:**
- Client ID: Environment variable `VITE_GOOGLE_CLIENT_ID`
- Redirect URI: `${origin}/auth/google/callback`
- Scopes: `email profile openid`
- Implementation: `frontend/src/services/api/auth.ts` (lines 219-250)
- Backend callback: `/api/v1/auth/google/callback`

**Auth Flow:**
1. Login: POST `/api/v1/auth/login` returns JWT tokens
2. Register: POST `/api/v1/auth/register`
3. Verify email: POST `/api/v1/auth/verify-email?token=`
4. Password reset: POST `/api/v1/auth/forgot-password`, `/api/v1/auth/reset-password`

## Real-Time Communication

**WebSocket:**
- URL: Environment variable `VITE_WS_URL` (default: `ws://localhost:8000/ws`)
- Implementation: `frontend/src/hooks/useWebSocket.ts`
- Context: `frontend/src/contexts/RealTimeContext.tsx`
- Features: Auto-reconnect, token auth, channel subscriptions

**WebSocket Message Types:**
- `recommendation_update` - Refresh recommendations
- `adaptation_trigger` - Learning path adaptations
- `performance_alert` - Performance notifications
- `learning_milestone` - Progress milestones
- `course_update` - Course content changes
- `notification` - General notifications
- `subscription_update` - Subscription changes
- `pong` - Keep-alive response

## Data Storage

**Databases:**
- Production: Backend microservices (details at api.tajiconnect.com)
- Development/Mock: JSON file database (`backend/db.json`)
  - ORM: json-server with lowdb
  - Collections: users, courses, careerPaths, assessments, roadmaps, onboarding

**Client-Side Storage:**
- localStorage: Auth tokens, user data, cached preferences
- Cache utility: `frontend/src/utils/cache.ts`

**File Storage:**
- Content uploads: `/api/v1/content/upload`
- Streaming: `/api/v1/content/{id}/stream`

**Caching:**
- Client-side: Custom cache implementation in `frontend/src/utils/cache.ts`
- Cache duration: Configurable via `REACT_APP_CACHE_DURATION` (default: 1800000ms = 30min)

## Payment Services

**M-Pesa Integration:**
- B2C endpoint: `/api/v1/payments/mpesa/b2c`
- Status check: `/api/v1/payments/mpesa/b2c/{transferId}`
- Callback: `/api/v1/payments/mpesa/callback`

**PayPal Integration:**
- Webhook: `/api/v1/webhooks/paypal`

**Subscription Management:**
- Create: POST `/api/v1/subscriptions`
- List: GET `/api/v1/subscriptions`
- Get: GET `/api/v1/subscriptions/{id}`

## Notifications

**Notification Service Endpoints:**
- List: GET `/api/v1/notifications`
- Send: POST `/api/v1/notifications/send`
- Mark read: POST `/api/v1/notifications/mark-read`
- Email: POST `/api/v1/notifications/email`
- SMS: POST `/api/v1/notifications/sms`
- Preferences: GET/PUT `/api/v1/notifications/preferences`

## CI/CD & Deployment

**Hosting:**
- Frontend: Netlify
  - Config: `netlify.toml`
  - Build: `npm run build` in `frontend/`
  - Publish: `frontend/dist`

**Netlify Configuration (`netlify.toml`):**
```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

# SPA routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# API proxy
[[redirects]]
  from = "/api/*"
  to = "https://api.tajiconnect.com/api/:splat"
  status = 200
  force = true
```

**Security Headers:**
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

## Environment Configuration

**Required Environment Variables (Frontend):**
```
VITE_API_URL=https://api.tajiconnect.com
VITE_GOOGLE_CLIENT_ID=<google-oauth-client-id>
```

**Optional Environment Variables (Frontend):**
```
VITE_WS_URL=wss://api.tajiconnect.com/ws
VITE_ENABLE_WEBSOCKET=true
VITE_WS_RECONNECT_INTERVAL=3000
VITE_WS_MAX_RECONNECT_ATTEMPTS=5
VITE_TOKEN_STORAGE_KEY=access_token
VITE_REFRESH_TOKEN_KEY=refresh_token
VITE_USER_STORAGE_KEY=user
```

**Required Environment Variables (Backend Mock):**
```
PORT=3001
NODE_ENV=development
DB_PATH=./db.json
```

**Optional AI Keys (Backend Mock):**
```
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...
AI_ENABLED=true
FALLBACK_TO_RULES=true
CONFIDENCE_THRESHOLD=70
```

**Secrets Location:**
- Development: `.env` files (not committed)
- Production: Netlify environment variables / Backend deployment config
- Example files: `frontend/.env.example`, `backend/.env.example`

## Webhooks & Callbacks

**Incoming:**
- Google OAuth callback: `/auth/google/callback` (frontend route)
- M-Pesa callback: `/api/v1/payments/mpesa/callback`
- PayPal webhook: `/api/v1/webhooks/paypal`

**Outgoing:**
- AI service calls to OpenAI/Gemini
- Notification service (email, SMS)

## Development Proxy

**Vite Dev Server (`frontend/vite.config.ts`):**
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
    secure: false,
  }
}
```

---

*Integration audit: 2026-02-02*
