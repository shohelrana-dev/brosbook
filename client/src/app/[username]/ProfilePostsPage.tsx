"use client"
import useInfiniteScroll from 'react-infinite-scroll-hook'
import {Facebook} from "react-content-loader"

import PostCard from "@components/post/PostCard"
import {useGetInfiniteListQuery} from "@hooks/useGetInfiniteListQuery"
import { useGetUserPostsQuery} from "@services/usersApi"
import {Post} from "@interfaces/posts.interfaces"
import {ListResponse} from "@interfaces/index.interfaces"
import {User} from "@interfaces/user.interfaces"

interface ProfilePostsPageProps {
    user: User
    initialPosts: ListResponse<Post>
}

export default function ProfilePostsPage({user, initialPosts}: ProfilePostsPageProps) {
    //hooks
    const {isLoading, items: posts, hasMoreItem, loadMoreItem} = useGetInfiniteListQuery<Post>(useGetUserPostsQuery, {userId: user?.id}, initialPosts)

    const [scrollBottomRef] = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: hasMoreItem,
        onLoadMore: loadMoreItem,
    })

    return (
        <div className=" pt-1 mb-6">
            { posts && posts.length > 0 ? posts.map(post => (
                <PostCard post={post} key={post.id}/>
            )) : (
                <p className="box text-center mt-5 py-10">Your feed is empty.</p>
            )}

            {isLoading ? (
                <>
                    <div className="box p-6 mt-6">
                        <Facebook/>
                    </div>
                    <div className="box p-6 mt-6">
                        <Facebook/>
                    </div>
                </>
            ) : null}


            {hasMoreItem ? (
                <div className="box mt-5 p-5" ref={scrollBottomRef}>
                    <Facebook/>
                </div>
            ) : null}

            {(posts.length > 0 && !hasMoreItem) ? (
                <p className="box text-center mt-5 py-10">No more posts</p>
            ) : null}

        </div>
    )
}
