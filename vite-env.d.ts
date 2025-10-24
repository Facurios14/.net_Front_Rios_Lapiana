// /net-Front_Rios_Lapiana/vite-env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
  // Puedes agregar más variables VITE_ aquí si las necesitas
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}