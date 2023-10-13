import { ChatsMembers } from './chat'
import { MessageExternal, MessageUnread } from './message'

export type Payload = MessageExternal | ChatsMembers | MessageUnread
