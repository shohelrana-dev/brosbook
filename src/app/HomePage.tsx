"use client"
import CreatePostForm from "@components/post/CreatePostForm"
import PostCard from "@components/post/PostCard"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetFeedPostsQuery } from "@services/postsApi"
import { Post } from "@interfaces/posts.interfaces"
import InfiniteScroll from 'react-infinite-scroller'
import LoadingPosts from "@components/loading/LoadingPosts"

export default function HomePage(){
    //hooks
    const {
              isLoading,
              items: posts,
              hasMoreItem,
              loadMoreItem
          } = useGetInfiniteListQuery<Post>( useGetFeedPostsQuery )

    return (
        <div className="pt-6 mb-4">
            <CreatePostForm/>
            { ( posts.length < 1 && isLoading ) ? <LoadingPosts/> : null }

            <InfiniteScroll
                loadMore={ loadMoreItem }
                hasMore={ hasMoreItem }
                loader={ <LoadingPosts/> }
            >
                { posts.map( ( post: Post ) => (
                    <PostCard post={ post } key={ post.id }/>
                ) ) }
            </InfiniteScroll>

            { ( ! isLoading && posts?.length < 1 ) ? (
                <p className="box text-center mt-5 py-10">Your feed is empty.</p>
            ) : null }
        </div>
    )
}
