"use client"
import React, { useState } from "react"
import { useGetSuggestedUsersQuery } from "@services/usersApi"
import { User } from "@interfaces/user.interfaces"
import UserItem from "@components/global/UserItem"
import InfiniteScroll from "react-infinite-scroll-component"
import UsersSkeleton from "@components/skeletons/UsersSkeleton"
import Error from "@components/global/Error"
import { ErrorResponse } from "@interfaces/index.interfaces"

export default function SuggestionsPage(){
    //hooks
    const [page, setPage]     = useState( 1 )
    const suggestedUsersQuery = useGetSuggestedUsersQuery( page )

    const { data: suggestedUsersData, isLoading, isSuccess, isError } = suggestedUsersQuery || {}
    const { items: users = [], nextPage }                             = suggestedUsersData || {}
    const error                                                       = suggestedUsersQuery.error as ErrorResponse || {}

    //decide content
    let content = null
    if( isLoading ){
        content = <UsersSkeleton/>
    } else if( isSuccess && users.length === 0 ){
        content = <p className="box text-center py-6">You have no suggestion.</p>
    } else if( isError ){
        content = <Error message={ error?.data?.message }/>
    } else if( isSuccess && users.length > 0 ){
        content = (
            <InfiniteScroll
                dataLength={ users.length }
                next={ () => setPage( nextPage! ) }
                hasMore={ !! nextPage }
                loader={ <UsersSkeleton/> }
            >
                { users.map( ( user: User ) => (
                    <div className="pb-1">
                        <UserItem user={ user } key={ user.id }/>
                    </div>
                ) ) }
            </InfiniteScroll>
        )
    }

    return (
        <div className="bg-white p-3 pt-4">
            <h2 className="text-lg md:text-xl font-bold mb-4">Suggested for you</h2>

            { content }
        </div>
    )
}