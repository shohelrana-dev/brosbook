"use client"
import React, { useState } from "react"
import { useGetFollowersQuery, useGetUserByUsernameQuery } from "@services/usersApi"
import { User } from "@interfaces/user.interfaces"
import UserItem from "@components/global/UserItem"
import InfiniteScroll from "react-infinite-scroll-component"
import UsersSkeleton from "@components/skeletons/UsersSkeleton"
import Error from "@components/global/Error"
import { ErrorResponse } from "@interfaces/index.interfaces"

interface Props {
    params: { username: string }
}

export default function FollowersPage( { params }: Props ){
    //hooks
    const [page, setPage] = useState( 1 )
    const { data: user }  = useGetUserByUsernameQuery( params.username )
    const followersQuery  = useGetFollowersQuery( { userId: user?.id!, page }, { skip: ! user?.id } )

    const { data: followersData, isLoading, isSuccess, isError } = followersQuery || {}
    const { items: followers = [], nextPage }                    = followersData || {}
    const error                                                  = followersQuery.error as ErrorResponse || {}

    //decide content
    let content = null
    if( isLoading ){
        content = <UsersSkeleton/>
    } else if( isSuccess && followers.length === 0 ){
        content = <p className="text-center">{ user?.fullName }'s haven't follower.</p>
    } else if( isError ){
        content = <Error message={ error.data?.message }/>
    } else if( isSuccess && followers.length > 0 ){
        content = (
            <InfiniteScroll
                next={ () => setPage( nextPage! ) }
                hasMore={ !! nextPage }
                loader={ <UsersSkeleton count={ 2 }/> }
                dataLength={ followers.length }
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