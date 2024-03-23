import { TypedUseQuery } from '@reduxjs/toolkit/query/react'
import { useEffect, useState } from 'react'
import { ListResponse } from '~/interfaces/index.interfaces'

export function useGetInfiniteListQuery<T>(
    useQueryHook: TypedUseQuery<ListResponse<T>, any, any>,
    searchParams: any = {},
    options?: any
) {
    const [page, setPage] = useState<number>(searchParams?.page ?? 1)
    let { data, ...rest } = useQueryHook({ ...searchParams, page }, options)
    const [items, setItems] = useState<T[] | null>(null)

    const hasMore = !!data?.nextPage

    function loadMore() {
        if (data?.nextPage) setPage(data.nextPage)
    }

    useEffect(() => {
        if (!data || !data?.items || data.items.length === 0) {
            setItems([])
            return
        }

        if (page === 1) {
            setItems(() => [...data.items])
        } else if (page === data.currentPage) {
            setItems((prevItems) => (prevItems ? [...prevItems, ...data.items] : data.items))
        }
    }, [data, page])

    return { hasMore, items, loadMore, setItems, data, ...rest }
}
