
export interface ListResponse<T> {
    items: T[]
    count: number
    currentPage: number
    lastPage: number
    nextPage: number
    prevPage: number
}

export interface Media {
    creatorId: string
    sourceId: string
    source: string
    name: string
    mimeType: string
    url: string
}
