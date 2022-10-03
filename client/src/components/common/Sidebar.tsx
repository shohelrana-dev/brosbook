import React, { useEffect, useState } from 'react'
import Link                           from "next/link"

import Avatar                  from "@components/common/Avatar"
import { User }                from '@interfaces/user.interfaces'
import { useGetManyUserQuery } from "@services/usersApi"
import useInfiniteScroll       from "react-infinite-scroll-hook"
import { CircularProgress }    from "@mui/material"


export default function Sidebar(){

    const [page, setPage]            = useState<number>( 1 )
    const { isLoading, data: users } = useGetManyUserQuery( { page } )
    const [userItems, setUserItems]  = useState<User[]>( users?.items || [] )

    async function handleFollowClick( user: User ){

    }

    const [scrollBottomRef] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: !! users?.nextPage,
        onLoadMore: async() => setPage( users?.nextPage! ),
    } )

    useEffect( () => setUserItems( [...userItems, ...users?.items || []] ), [users] )

    return (
        <div className="box p-5">
            <h2 className="text-xl font-medium mb-3">Suggested People</h2>

            { userItems.length > 0 && userItems.map( user => (
                <div className="flex" key={ user.id }>
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
                                    <h4 className="text-sm text-gray-700">
                                        @{ user.username }
                                    </h4>
                                </a>
                            </Link>
                            <div>
                                <button onClick={ () => handleFollowClick( user ) }
                                        className="button-blue rounded-full py-2 px-5">
                                    Follow
                                </button>
                            </div>
                        </div>
                        <div className="mt-2">{ user.profile?.bio }</div>
                    </div>
                </div>
            ) ) }
            { users?.nextPage ? (
                <div className="flex justify-center min-h-[300px] items-center" ref={ scrollBottomRef }>
                    <CircularProgress/>
                </div>
            ) : (
                <p className="box text-center mt-5 py-10">No more users</p>
            ) }
        </div>
    )
}