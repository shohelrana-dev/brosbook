"use client"
import React from "react"
import { useGetFollowersQuery, useGetUserByUsernameQuery } from "@services/usersApi"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { User } from "@interfaces/user.interfaces"
import UserItem from "@components/global/UserItem"
import InfiniteScroll from "react-infinite-scroller"
import UsersSkeleton from "@components/skeletons/UsersSkeleton"
import Error from "@components/global/Error"

interface Props {
    params: { username: string }
}

export default function FollowersPage( { params }: Props ){
    //hooks
    const { data: user } = useGetUserByUsernameQuery( params.username )
    const {
              isLoading,
              isSuccess,
              isError,
              items: followers,
              error,
              loadMore,
              hasMore
          }              = useGetInfiniteListQuery<User>( useGetFollowersQuery, { userId: user?.id! } )

    //decide content
    let content = null
    if( isLoading ){
        content = <UsersSkeleton/>
    } else if( isSuccess && followers.length === 0 ){
        content = <p className="text-center">{ user?.fullName }'s haven't follower.</p>
    } else if( isError ){
        content = <Error message={ error?.data?.message }/>
    } else if( isSuccess && followers.length > 0 ){
        content = (
            <InfiniteScroll
                loadMore={ loadMore }
                hasMore={ hasMore }
                loader={ <UsersSkeleton count={ 2 }/> }
            >
                { followers.map( ( user: User ) => (
                    <div className="mb-2">
                        <UserItem user={ user } key={ user.id }/>
                    </div>
                ) ) }
            </InfiniteScroll>
        )
    }

    return (
        <div className="box p-3">
            { content }
        </div>
    )
}