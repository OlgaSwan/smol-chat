import { Models } from 'appwrite'

export type Credentials = {
  email: string
  password: string
  password1?: string
}

export type CredentialsRegister = {
  name: string
  email: string
  password: string
  password1: string
}

export type User = {
  name: string
  bio?: string
  photo_id?: string
} & Models.Document
