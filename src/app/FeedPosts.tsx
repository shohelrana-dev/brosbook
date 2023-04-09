"use client"
import { useState } from "react"
import { useGetFeedPostsQuery } from "@services/postsApi"
import PostsSkeleton from "@components/skeletons/PostsSkeleton"
import Error from "@components/global/Error"
import PostList from "@components/post/PostList"
import { ErrorResponse } from "@interfaces/index.interfaces"

export default function FeedPosts(){
    //hooks
    const [page, setPage] = useState<number>( 1 )
    const feedPostsQuery  = useGetFeedPostsQuery( page )

    const { isLoading, isSuccess, isError, data: postsData } = feedPostsQuery || {}
    const { items: posts = [], nextPage }                    = postsData || {}
    const error                                              = feedPostsQuery.error as ErrorResponse || {}

    //decide content
    let content = null
    if( isLoading ){
        content = <PostsSkeleton/>
    } else if( isSuccess && posts.length === 0 ){
        content = <p className="box text-center py-6">Your feed is empty.</p>
    } else if( isError ){
        content = <Error message={ error.data?.message }/>
    } else if( isSuccess && posts.length > 0 ){
        content = <PostList posts={ posts } loadMore={ () => setPage( nextPage! ) } hasMore={ !! nextPage }/>
    }

    return content
}
