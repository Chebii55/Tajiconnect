/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_VERSION: string;
  readonly VITE_API_BASE_PATH: string;
  readonly VITE_WS_URL: string;
  readonly VITE_ENABLE_WEBSOCKET: string;
  readonly VITE_WS_RECONNECT_INTERVAL: string;
  readonly VITE_WS_MAX_RECONNECT_ATTEMPTS: string;
  readonly VITE_TOKEN_STORAGE_KEY: string;
  readonly VITE_REFRESH_TOKEN_KEY: string;
  readonly VITE_USER_STORAGE_KEY: string;
  readonly VITE_CACHE_DURATION: string;
  readonly VITE_PROFILE_CACHE_TTL: string;
  readonly VITE_RECOMMENDATIONS_CACHE_TTL: string;
  readonly VITE_ENV: string;
  readonly VITE_DEBUG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
