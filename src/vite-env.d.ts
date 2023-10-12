/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROJECT_ID: string
  readonly VITE_DATABASE_ID: string
  readonly VITE_COLLECTION_ID_USERS: string
  readonly VITE_COLLECTION_ID_MESSAGES: string
  readonly VITE_COLLECTION_ID_CHATS: string
  readonly VITE_COLLECTION_ID_CHATS_MEMBERS: string
  readonly VITE_BUCKET_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
