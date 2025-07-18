/// <reference types="vite/client" />

declare global {
  interface ImportMeta {
    glob: (pattern: string, options?: { eager?: boolean }) => Record<string, any>
  }
}

export {}
