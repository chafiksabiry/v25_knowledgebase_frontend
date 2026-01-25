/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_QIANKUN: string;
  readonly VITE_RUN_MODE: string;
  readonly VITE_STANDALONE_COMPANY_ID: string;
  readonly VITE_COMPANY_ORCHESTRATOR_URL: string;
  readonly VITE_GIGS_API_URL: string;
  readonly VITE_BACKEND_KNOWLEDGEBASE_API: string;
  readonly VITE_STANDALONE_USER_ID: string;
  readonly VITE_API_URL_ONBOARDING: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}