import {useEffect, useState} from "react"
import {UseQuery} from "@reduxjs/toolkit/src/query/react/buildHooks"
import {QueryDefinition} from "@reduxjs/toolkit/query"
import {ListResponse} from "@interfaces/index.interfaces";

export function useGetInfiniteListQuery<T>(useQueryHook: UseQuery<QueryDefinition<any, any, any, any>>, queryParams = {}, initialData?: ListResponse<T>) {
    const [page, setPage] = useState<number>(1)
    let {isLoading, data} = useQueryHook({page, ...queryParams}, {skip: initialData && page === 1})
    const [items, setItems] = useState<T[]>(initialData?.items || [])

    if(page === 1 && initialData){
        data  = initialData
    }

    const hasMoreItem = !!data?.nextPage

    function loadMoreItem(){
        if(hasMoreItem){
            setPage(data.nextPage)
        }
    }


    useEffect(() => {
        if(page === 1 && initialData) return

        if (!data?.items || data.items.length < 1) return

        if (page === 1) {
            setItems(data.items)
        }else if ( page === data.currentPage) {
            setItems(prevItems => [...prevItems, ...data.items])
        }
    }, [data?.items])

    return {isLoading, hasMoreItem, items, loadMoreItem}
}
