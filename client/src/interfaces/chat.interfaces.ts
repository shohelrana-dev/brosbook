import { User }                           from "@interfaces/user.interfaces"

export interface Conversation {
    id: string
    identifier: string
    lastMessage?: string
    ownerId: string
    participantId: string
    participant: User
    seen: number
    unseenCount?: number
    updatedAt: string
}

export interface Message {
    id: string
    conversationIdentifier: string
    senderId: number
    body?: string
    image?: string
    imageUrl?: string
    type: string
    reactions: Reaction[]
    createdAt: string
}

export interface MessagePayload {
    body?: string
    file?: string
    sender: string
    type: string
    participant: string
    currentUsername: string
}

export interface ReactionPayload {
    messageId: number
    reaction: string
    sender: string
}

export interface Reaction {
    id: string
    senderId: number
    messageId: number
    name: string
    url: string
}