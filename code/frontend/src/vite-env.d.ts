/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COMMISSION_QUOTE_API_BASE_URL?: string;
  readonly VITE_COMMISSION_QUOTE_API_KEY?: string;
  readonly VITE_COMMISSION_QUOTE_API_TIMEOUT_MS?: string;
  readonly VITE_COMMISSION_QUOTE_FORM_CONTEXT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
