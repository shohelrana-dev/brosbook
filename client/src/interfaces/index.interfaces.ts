
export interface ListResponse<T> {
    items: T[]
    count: number
    currentPage: number
    lastPage: number
    nextPage: number
    prevPage: number
}
