import {useEffect, useState} from "react"
import {UseQuery} from "@reduxjs/toolkit/src/query/react/buildHooks"
import {QueryDefinition} from "@reduxjs/toolkit/query"

export function useGetInfiniteListQuery<T>(useQueryHook: UseQuery<QueryDefinition<any, any, any, any>>, queryParams = {}) {
    const [page, setPage] = useState<number>(1)
    const {isLoading, data} = useQueryHook({page, ...queryParams})
    const [items, setItems] = useState<T[]>([])

    const hasMoreItem = !!data?.nextPage

    function loadMoreItem(){
        if(hasMoreItem){
            setPage(data.nextPage)
        }
    }


    useEffect(() => {
        if (data?.items && data.items.length > 0) {
            if (page === 1) {
                setItems(data.items)
            }else if ( page === data.currentPage) {
                setItems(prevItems => [...prevItems, data.items])
            }
        }
    }, [data])

    return {isLoading, hasMoreItem, items, loadMoreItem}
}
