import React from 'react'
import Link from "next/link"
import useInfiniteScroll from "react-infinite-scroll-hook"

import Avatar from "@components/common/Avatar"
import {User} from "@interfaces/user.interfaces"
import {useGetSuggestedUsersQuery} from "@services/usersApi"
import FollowButton from "@components/common/FollowButton"
import Loading from "@components/common/Loading"
import {useGetInfiniteListQuery} from "@hooks/useGetInfiniteListQuery"

function SuggestedPeople() {
    const {
        isLoading,
        items: users,
        loadMoreItem,
        hasMoreItem
    } = useGetInfiniteListQuery<User>(useGetSuggestedUsersQuery)

    const [scrollBottomRef] = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: hasMoreItem,
        onLoadMore: loadMoreItem,
    })

    return (
        <>
            <h2 className="text-xl font-medium mb-5">Suggested People</h2>

            {isLoading && !hasMoreItem ? <Loading size={30}/> : null}

            {users.length > 0 ? users.map(user => (
                <div className="flex justify-between items-center mb-4" key={user.id}>
                    <div className="flex">
                        <Link href={`/${user.username}`} className="block min-w-[40px] mr-2">
                            <Avatar src={user.avatar}/>
                        </Link>
                        <div>
                            <div className="flex justify-between">
                                <Link href={`/${user.username}`}>
                                    <h3 className="text-md font-medium">
                                        {user.fullName}
                                    </h3>
                                    <h4 className="text-xs text-gray-500">
                                        @{user.username}
                                    </h4>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div>
                        <FollowButton user={user}/>
                    </div>

                </div>
            )) : null}
            {hasMoreItem ? (
                <div ref={scrollBottomRef}>
                    <Loading size={25}/>
                </div>
            ) : null}
        </>
    )
}

export default SuggestedPeople