import React, { useEffect, useState } from 'react'
import Link                           from "next/link"
import { CircularProgress, Zoom }     from "@mui/material"
import useInfiniteScroll              from "react-infinite-scroll-hook"

import Avatar       from "@components/common/Avatar"
import { User }     from "@interfaces/user.interfaces"
import {
    useFollowMutation,
    useGetSuggestedUsersQuery,
    useUnfollowMutation
}                   from "@services/usersApi"
import FollowButton from "@components/common/FollowButton";

function SuggestedPeople(){
    const [page, setPage]            = useState<number>( 1 )
    const { isLoading, data: users } = useGetSuggestedUsersQuery( { page } )
    const [userItems, setUserItems]  = useState<User[]>( [] )

    const [scrollBottomRef] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: !! users?.nextPage,
        onLoadMore: async() => setPage( users?.nextPage! ),
    } )

    useEffect( () => setUserItems( [...userItems, ...users?.items || []] ), [users] )

    return (
        <>
            <h2 className="text-xl font-medium mb-3">Suggested People</h2>

            { userItems.length > 0 && userItems.map( user => (
                <div className="flex justify-between" key={ user.id }>
                    <div className="flex">
                        <Link href={ `/${ user.username }` }>
                            <a className="block min-w-[40px] mr-2">
                                <Avatar src={ user.photo }/>
                            </a>
                        </Link>
                        <div>
                            <div className="flex justify-between">
                                <Link href={ `/${ user.username }` }>
                                    <a>
                                        <h3 className="text-md font-medium">
                                            { user.fullName }
                                        </h3>
                                        <h4 className="text-xs text-gray-500">
                                            @{ user.username }
                                        </h4>
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div>
                        <FollowButton user={ user }/>
                    </div>

                </div>
            ) ) }
            { users?.nextPage && (
                <div className="flex justify-center min-h-[300px] items-center" ref={ scrollBottomRef }>
                    <CircularProgress/>
                </div>
            ) }
        </>
    )
}

export default SuggestedPeople