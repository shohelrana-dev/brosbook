"use client"
import PostCard from "@components/post/PostCard"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetPostsQuery } from "@services/postsApi"
import { Post } from "@interfaces/posts.interfaces"
import InfiniteScroll from "react-infinite-scroller"
import PostsLoader from "@components/loaders/PostsLoader"
import Loading from "@components/global/Loading"
import { useGetUserByUsernameQuery } from "@services/usersApi"

interface Props {
    params: { username: string }
}

export default function UserPostsPage( { params }: Props ){
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
                loader={ <PostsLoader/> }
            >
                { posts && posts.map( ( post: Post ) => (
                    <PostCard post={ post } key={ post.id }/>
                ) ) }
            </InfiniteScroll>

            { ( ! isLoading && ! isFetching && posts?.length < 1 ) ? (
                <p className="box text-center py-6">{ user?.fullName }'s haven't any post.</p>
            ) : null }
        </div>
    )
}
