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

export interface ListResponse<T> extends PaginateMeta {
    items: T[]
}

export interface ListQueryParams {
    page?: number
    limit?: number
}

export interface SearchQueryParams {
    query: string
    page?: number
    limit?: number
}

export interface PostsQueryParams {
    userId?: string
    page?: number
    limit?: number
}