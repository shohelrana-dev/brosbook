"use client"
import React from "react"
import { useGetFollowingsQuery, useGetUserByUsernameQuery } from "@services/usersApi"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { User } from "@interfaces/user.interfaces"
import UserItem from "@components/global/UserItem"
import InfiniteScroll from "react-infinite-scroller"
import UsersSkeleton from "@components/skeletons/UsersSkeleton"
import Loading from "@components/global/Loading"
import Error from "@components/global/Error"

interface Props {
    params: { username: string }
}

export default function FollowingPage( { params }: Props ){
    //hooks
    const { data: user } = useGetUserByUsernameQuery( params.username )
    const {
              isLoading,
              isSuccess,
              isError,
              items: followings,
              error,
              loadMore,
              hasMore
          }              = useGetInfiniteListQuery<User>(
        useGetFollowingsQuery, { userId: user?.id! }
    )


    //decide content
    let content = null
    if( isLoading ){
        content = <Loading size={ 50 }/>
    } else if( isSuccess && followings.length === 0 ){
        content = <p className="text-center">{ user?.fullName }'s haven't following.</p>
    } else if( isError ){
        content = <Error message={ error?.data?.message }/>
    } else if( isSuccess && followings.length > 0 ){
        content = (
            <InfiniteScroll
                loadMore={ loadMore }
                hasMore={ hasMore }
                loader={ <UsersSkeleton count={ 2 }/> }
            >
                { followings.map( ( user: User ) => (
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