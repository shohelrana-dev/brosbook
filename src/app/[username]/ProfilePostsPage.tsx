"use client"
import PostCard from "@components/post/PostCard"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetPostsQuery } from "@services/postsApi"
import { Post } from "@interfaces/posts.interfaces"
import { ListResponse } from "@interfaces/index.interfaces"
import { User } from "@interfaces/user.interfaces"
import InfiniteScroll from "react-infinite-scroll-component"
import LoadingPosts from "@components/loading/LoadingPosts"

interface ProfilePostsPageProps {
    user: User
    initialPosts: ListResponse<Post>
}

export default function ProfilePostsPage( { user, initialPosts }: ProfilePostsPageProps ){
    //hooks
    let {
            isLoading,
            isFetching,
            items: posts,
            hasMoreItem,
            loadMoreItem
        } = useGetInfiniteListQuery<Post>( useGetPostsQuery, { userId: user?.id } )

    if( posts.length < 1 ){
        posts = initialPosts.items
    }
    const endMessage = ( ! isLoading && ! isFetching && posts?.length < 1 ) ?
        <p className="box text-center mt-5 py-10">User haven't any post.</p> : null

    return (
        <div className="pt-1">
            { ( ! posts && isLoading ) ? <LoadingPosts/> : null }

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
