import { useEffect, useState } from "react"
import { UseQuery, UseQueryStateOptions } from "@reduxjs/toolkit/src/query/react/buildHooks"
import { QueryDefinition } from "@reduxjs/toolkit/query"

export function useGetInfiniteListQuery<T>( useQueryHook: UseQuery<QueryDefinition<any, any, any, any>>, queryParams = {}, options?: UseQueryStateOptions<any, any> ){
    const [page, setPage]   = useState<number>( 1 )
    let { data, ...rest }   = useQueryHook( { page, ...queryParams }, options )
    const [items, setItems] = useState<T[]>( [] )

    const hasMoreItem = !! data?.nextPage

    function loadMoreItem(){
        if( hasMoreItem ){
            setPage( data.nextPage )
        }
    }


    useEffect( () => {
        if( ! data?.items || data.items.length < 1 ) return

        if( page === 1 ){
            setItems( data.items )
        } else if( page === data.currentPage ){
            setItems( prevItems => [...prevItems, ...data.items] )
        }
    }, [data?.items] )

    return { hasMoreItem, items, loadMoreItem, setItems, ...rest }
}
