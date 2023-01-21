"use client"
import CreatePostForm from "@components/post/CreatePostForm"
import PostCard from "@components/post/PostCard"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetFeedPostsQuery } from "@services/postsApi"
import { Post } from "@interfaces/posts.interfaces"
import InfiniteScroll from 'react-infinite-scroll-component'
import LoadingPosts from "@components/loading/LoadingPosts"

export default function HomePage(){
    //hooks
    const {
              isLoading,
              isFetching,
              items: posts,
              hasMoreItem,
              loadMoreItem
          } = useGetInfiniteListQuery<Post>( useGetFeedPostsQuery )

    const endMessage = ( ! isLoading && ! isFetching && posts?.length < 1 ) ?
        <p className="box text-center mt-5 py-10">Your feed is empty.</p> : null

    return (
        <div className="pt-6 mb-6">
            <CreatePostForm/>
            { ( posts.length < 1 && isLoading ) ? <LoadingPosts/> : null }

            <InfiniteScroll
                next={ loadMoreItem }
                hasMore={ hasMoreItem }
                loader={ <LoadingPosts/> }
                dataLength={ posts?.length }
                endMessage={ endMessage }
            >
                { posts.map( ( post: Post ) => (
                    <PostCard post={ post } key={ post.id }/>
                ) ) }
            </InfiniteScroll>
        </div>
    )
}
