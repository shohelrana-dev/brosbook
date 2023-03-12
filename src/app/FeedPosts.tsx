"use client"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetFeedPostsQuery } from "@services/postsApi"
import { Post } from "@interfaces/posts.interfaces"
import PostsSkeleton from "@components/skeletons/PostsSkeleton"
import Error from "@components/global/Error"
import PostList from "@components/post/PostList"

export default function FeedPosts(){
    //hooks
    const { isLoading, items: posts, hasMore, loadMore, isSuccess, isError, error } = useGetInfiniteListQuery<Post>(
        useGetFeedPostsQuery
    )

    //decide content
    let content = null
    if( isLoading ){
        content = <PostsSkeleton/>
    } else if( isSuccess && posts.length === 0 ){
        content = <p className="box text-center py-6">Your feed is empty.</p>
    } else if( isError ){
        content = <Error message={ error?.data?.message }/>
    } else if( isSuccess && posts.length > 0 ){
        content = <PostList posts={ posts } loadMore={ loadMore } hasMore={ hasMore }/>
    }

    return content
}
