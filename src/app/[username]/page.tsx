"use client"
import { useGetPostsQuery } from "@services/postsApi"
import PostsSkeleton from "@components/skeletons/PostsSkeleton"
import { useGetUserByUsernameQuery } from "@services/usersApi"
import Error from "@components/global/Error"
import React, { useState } from "react"
import { ErrorResponse } from "@interfaces/index.interfaces"
import PostList from "@components/post/PostList"

interface Props {
    params: { username: string }
}

export default function UserPostsPage( { params }: Props ){
    //hooks
    const [page, setPage] = useState<number>( 1 )
    const { data: user }  = useGetUserByUsernameQuery( params.username )
    const postsQuery      = useGetPostsQuery( { userId: user?.id, page }, { skip: ! user?.id } )

    const { isLoading, isSuccess, isError, data: postsData } = postsQuery || {}
    const { items: posts, nextPage }                         = postsData || {}
    const error                                              = postsQuery.error as ErrorResponse || {}

    //decide content
    let content = null
    if( isLoading ){
        content = <PostsSkeleton/>
    } else if( isSuccess && posts?.length === 0 ){
        content = <p className="box text-center py-6">{ user?.fullName }'s haven't any post.</p>
    } else if( isError ){
        content = <Error message={ error.data?.message }/>
    } else if( isSuccess && posts && posts?.length > 0 ){
        content = (
            <PostList
                posts={ posts }
                loadMore={ () => setPage( nextPage! ) }
                hasMore={ !! nextPage }
            />
        )
    }

    return (
        <div className="mt-1">
            { content }
        </div>
    )
}
