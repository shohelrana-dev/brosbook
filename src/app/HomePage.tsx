"use client"
import CreatePostForm from "@components/post/CreatePostForm"
import PostCard from "@components/post/PostCard"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetFeedPostsQuery } from "@services/postsApi"
import { Post } from "@interfaces/posts.interfaces"
import InfiniteScroll from 'react-infinite-scroller'
import PostsLoader from "@components/loaders/PostsLoader"

export default function HomePage(){
    //hooks
    const {
              isLoading,
              items: posts,
              hasMoreItem,
              loadMoreItem,
              isSuccess,
              isError
          } = useGetInfiniteListQuery<Post>( useGetFeedPostsQuery )

    return (
        <div className="mt-5 mb-4">
            <CreatePostForm/>
            { ( posts.length < 1 && isLoading ) ? <PostsLoader/> : null }

            <InfiniteScroll
                loadMore={ loadMoreItem }
                hasMore={ hasMoreItem }
                loader={ <PostsLoader/> }
            >
                { posts.map( ( post: Post ) => (
                    <PostCard post={ post } key={ post.id }/>
                ) ) }
            </InfiniteScroll>

            { ( ( isSuccess || isError ) && posts?.length < 1 ) ? (
                <p className="box text-center py-6">Your feed is empty.</p>
            ) : null }
        </div>
    )
}
