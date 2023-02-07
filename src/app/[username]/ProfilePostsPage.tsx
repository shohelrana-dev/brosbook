"use client"
import PostCard from "@components/post/PostCard"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetPostsQuery } from "@services/postsApi"
import { Post } from "@interfaces/posts.interfaces"
import { ListResponse } from "@interfaces/index.interfaces"
import { User } from "@interfaces/user.interfaces"
import InfiniteScroll from "react-infinite-scroller"
import LoadingPosts from "@components/loading/LoadingPosts"
import Loading from "@components/common/Loading";

interface ProfilePostsPageProps {
    user: User
    initialPosts: ListResponse<Post>
}

export default function ProfilePostsPage( { user, initialPosts }: ProfilePostsPageProps ){
    //hooks
    let {
            isLoading,
            items: posts,
            hasMoreItem,
            loadMoreItem
        } = useGetInfiniteListQuery<Post>( useGetPostsQuery, { userId: user?.id } )

    if( posts.length < 1 ){
        posts = initialPosts.items
    }

    if( isLoading && posts?.length < 1 ){
        return <Loading/>
    }

    return (
        <div className="pt-1">
            <InfiniteScroll
                loadMore={ loadMoreItem }
                hasMore={ hasMoreItem }
                loader={ <LoadingPosts/> }
            >
                { posts.map( ( post: Post , index:number) => (
                    <PostCard post={ post } key={ index }/>
                ) ) }
            </InfiniteScroll>

            { ( ! isLoading && posts?.length < 1 ) ? (
                <p className="box text-center py-6">{ user?.fullName }'s haven't any post.</p>
            ) : null }
        </div>
    )
}
