import type { Models } from "appwrite";

export type Message = {
    body: string
    user_name?: string
    user_id?: string
} & Models.Document
