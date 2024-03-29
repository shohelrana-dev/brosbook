import { Media } from '~/interfaces/index.interfaces'
import { User } from '~/interfaces/user.interfaces'

export interface Conversation {
   id: string
   lastMessage?: Message
   user1: User
   user2: User
   participant: User
   unreadMessagesCount: number
}

export enum MessageType {
   IMAGE = 'image',
   FILE = 'file',
   TEXT = 'text',
   EMOJI = 'emoji',
}

export interface Message {
   id: string
   conversation?: Conversation
   sender: User
   body?: string
   image?: Media
   type: MessageType
   reactions: Reaction[]
   seenAt: string
   isMeSender: boolean
   createdAt: string
}

export interface MessagePayload {
   conversationId: string
   body?: string
   image?: Blob
   type: MessageType
}

export interface ReactionPayload {
   messageId: number
   reaction: string
   sender: string
}

export interface Reaction {
   id: string
   sender: User
   message: Message
   name: string
   url: string
}
