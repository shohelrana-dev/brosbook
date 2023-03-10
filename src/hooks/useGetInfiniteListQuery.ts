import { useEffect, useState } from "react"
import { UseQuery, UseQueryStateOptions } from "@reduxjs/toolkit/dist/query/react/buildHooks"
import { QueryDefinition } from "@reduxjs/toolkit/query"

export function useGetInfiniteListQuery<T>( useQueryHook: UseQuery<QueryDefinition<any, any, any, any>>, queryParams: any = {}, options?: UseQueryStateOptions<any, any> ){
    const [page, setPage]   = useState<number>( queryParams?.page ?? 1 )
    let { data, ...rest }   = useQueryHook( { ...queryParams, page }, options )
    const [items, setItems] = useState<T[]>( [] )

    const hasMore = !! data?.nextPage

    function loadMore(){
        if( hasMore ){
            setPage( data.nextPage )
        }
    }


    useEffect( () => {
        if( ! data?.items || data.items.length < 1 ){
            setItems( () => [] )
            return
        }

        if( page === 1 ){
            setItems( () => [...data.items] )
        } else if( page === data.currentPage ){
            setItems( prevItems => [...prevItems, ...data.items] )
        }
    }, [data?.items] )

    return { hasMore, items, loadMore, setItems, data, ...rest }
}
