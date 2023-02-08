"use client"
import PostCard from "@components/post/PostCard"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetPostsQuery } from "@services/postsApi"
import { Post } from "@interfaces/posts.interfaces"
import InfiniteScroll from "react-infinite-scroller"
import LoadingPosts from "@components/loading/LoadingPosts"
import Loading from "@components/common/Loading"
import { useGetUserByUsernameQuery } from "@services/usersApi"

interface Props {
    params: { username: string }
}

export default function ProfilePostsPage( { params }: Props ){
    //hooks
    const { data: user } = useGetUserByUsernameQuery( params.username )
    const {
              isLoading,
              isFetching,
              items: posts,
              hasMoreItem,
              loadMoreItem
          }              = useGetInfiniteListQuery<Post>( useGetPostsQuery, { userId: user?.id } )

    if( isLoading && posts?.length < 1 ){
        return (
            <div className="box text-center py-3">
                <Loading size={ 45 }/>
            </div>
        )
    }

    return (
        <div className="pt-1">
            <InfiniteScroll
                loadMore={ loadMoreItem }
                hasMore={ hasMoreItem }
                loader={ <LoadingPosts/> }
            >
                { posts.map( ( post: Post, index: number ) => (
                    <PostCard post={ post } key={ index }/>
                ) ) }
            </InfiniteScroll>

            { ( ! isLoading && ! isFetching && posts?.length < 1 ) ? (
                <p className="box text-center py-6">{ user?.fullName }'s haven't any post.</p>
            ) : null }
        </div>
    )
}
