import { PaginateMeta } from "@interfaces/index.interfaces"

export function paginateMeta( total: number, page: number, limit: number ): PaginateMeta {
    //parse to number
    total = Number( total )
    page  = Number( page )
    limit = Number( limit )

    //logic
    const lastPage = Math.ceil( total / limit )
    const nextPage = page + 1 > lastPage ? null : page + 1
    const prevPage = page - 1 < 1 ? null : page - 1

    return {
        count: total,
        currentPage: page,
        nextPage: nextPage,
        prevPage: prevPage,
        lastPage: lastPage,
    }
}