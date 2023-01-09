"use client"
import CreatePostForm from "@components/post/CreatePostForm"
import PostCard from "@components/post/PostCard"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetFeedPostsQuery } from "@services/postsApi"
import { Post } from "@interfaces/posts.interfaces"
import AnimatePage from "@components/common/AnimatePage"
import SidebarLayout from "@components/common/SidebarLayout"
import InfiniteScroll from 'react-infinite-scroll-component'
import LoadingPosts from "@components/loading/LoadingPosts"

export default function HomePage(){
    //hooks
    const { isLoading, items: posts, hasMoreItem, loadMoreItem } = useGetInfiniteListQuery<Post>( useGetFeedPostsQuery )

    const endMessage = posts?.length > 0 ? 'No more posts' : 'Your feed is empty.'

    return (
        <AnimatePage>
            <SidebarLayout>
                <div className="pt-6 mb-6">
                    <CreatePostForm/>

                    { ( ! posts && isLoading ) ? <LoadingPosts/> : null }

                    <InfiniteScroll
                        next={ loadMoreItem }
                        hasMore={ hasMoreItem }
                        loader={ <LoadingPosts/> }
                        dataLength={ posts?.length }
                        endMessage={ <p className="box text-center mt-5 py-10">{ endMessage }</p> }
                    >
                        { posts.map( ( post: Post) => (
                            <PostCard post={ post } key={ post.id }/>
                        ) ) }
                    </InfiniteScroll>

                </div>
            </SidebarLayout>
        </AnimatePage>
    )
}
