import React, { useEffect, useState } from 'react'
import Link                           from "next/link"
import useInfiniteScroll              from "react-infinite-scroll-hook"

import Avatar       from "@components/common/Avatar"
import { User }     from "@interfaces/user.interfaces"
import { useGetSuggestedUsersQuery} from "@services/usersApi"
import FollowButton from "@components/common/FollowButton"
import Loading from "@components/common/Loading"

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

            {isLoading && <Loading size={30}/>}

            { userItems.length > 0 && userItems.map( user => (
                <div className="flex justify-between items-center" key={ user.id }>
                    <div className="flex">
                        <Link href={ `/${ user.username }` } className="block min-w-[40px] mr-2">
                            <Avatar src={ user.photo }/>
                        </Link>
                        <div>
                            <div className="flex justify-between">
                                <Link href={ `/${ user.username }` }>
                                    <h3 className="text-md font-medium">
                                        { user.fullName }
                                    </h3>
                                    <h4 className="text-xs text-gray-500">
                                        @{ user.username }
                                    </h4>
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
                <div ref={ scrollBottomRef }>
                    <Loading/>
                </div>
            ) }
        </>
    )
}

export default SuggestedPeople