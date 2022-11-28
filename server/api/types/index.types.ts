import User from "@entities/User"

export interface Auth {
    user?: {
        id: string,
        username: string,
        email: string
    }
    isAuthenticated: boolean
}

export interface LoginTokenPayload {
    access_token: string
    expires_in: number | string
    token_type?: string
    user: User,
    message?: string
}

export interface MessageDataDto {
    senderId: number
    participantId: number
    conversationIdentifier: string
    body?: string
    type: 'text' | 'image' | 'emoji'
    base64Image?: string
    imageName?: string
}

export interface ReactionDataDto {
    senderId: number
    name: string
    messageId: number
}

export interface PaginateMeta {
    count: number,
    currentPage: number,
    nextPage: number,
    prevPage: number,
    lastPage: number,
}

export interface PaginateQuery {
    page?: number
    limit?: number
    userId?: string
}