/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL_ONBOARDING: string;
    readonly VITE_BACKEND_KNOWLEDGEBASE_API: string;
    // Add other variables as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
