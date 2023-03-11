"use client"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetPostsQuery } from "@services/postsApi"
import { Post } from "@interfaces/posts.interfaces"
import PostsSkeleton from "@components/skeletons/PostsSkeleton"
import { useGetUserByUsernameQuery } from "@services/usersApi"
import Error from "@components/global/Error"
import PostList from "@components/post/PostList"

interface Props {
    params: { username: string }
}

export default function UserPostsPage( { params }: Props ){
    //hooks
    const { data: user }                                                            = useGetUserByUsernameQuery( params.username )
    const { isLoading, isSuccess, isError, items: posts, error, hasMore, loadMore } = useGetInfiniteListQuery<Post>(
        useGetPostsQuery, { userId: user?.id }
    )

    //decide content
    let content = null
    if( isLoading ){
        content = <PostsSkeleton/>
    } else if( isSuccess && posts.length === 0 ){
        content = <p className="box text-center py-6">{ user?.fullName }'s haven't any post.</p>
    } else if( isError ){
        content = <Error message={ error?.data?.message }/>
    } else if( isSuccess && posts.length > 0 ){
        content = <PostList posts={ posts } loadMore={ loadMore } hasMore={ hasMore }/>
    }

    return (
        <div className="mt-1">
            { content }
        </div>
    )
}
