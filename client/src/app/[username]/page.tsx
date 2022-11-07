"use client"
import useInfiniteScroll from 'react-infinite-scroll-hook'
import {Facebook} from "react-content-loader"

import PostCard from "@components/post/PostCard"
import {useGetInfiniteListQuery} from "@hooks/useGetInfiniteListQuery"
import {useGetUserByUsernameQuery, useGetUserPostsQuery} from "@services/usersApi"
import {Post} from "@interfaces/posts.interfaces"

interface ProfilePostsPageProps {
    params: {username: string}
}

export default function ProfilePostsPage({params}: ProfilePostsPageProps) {
    //hooks
    const {data: user} = useGetUserByUsernameQuery(params.username)
    const {isLoading, items: posts, hasMoreItem, loadMoreItem} = useGetInfiniteListQuery<Post>(useGetUserPostsQuery, {userId: user?.id})
    const [scrollBottomRef] = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: hasMoreItem,
        onLoadMore: loadMoreItem,
    })

    return (
        <div className=" pt-1 mb-6">
            {!isLoading ? (posts.length > 0 ? posts.map(post => (
                <PostCard post={post} key={post.id}/>
            )) : (
                <p className="box text-center mt-5 py-10">Your feed is empty.</p>
            )) : null}

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
