import { atom } from 'nanostores'

import { User } from '../types/auth-context'

const User = atom<User | null>(null)
