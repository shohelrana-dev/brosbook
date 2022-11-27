"use client"
import useInfiniteScroll from 'react-infinite-scroll-hook'
import {Facebook} from "react-content-loader"

import CreatePostForm from "@components/post/CreatePostForm"
import PostCard from "@components/post/PostCard"
import {useGetInfiniteListQuery} from "@hooks/useGetInfiniteListQuery"
import {useGetFeedPostsQuery} from "@services/postsApi"
import {Post} from "@interfaces/posts.interfaces"

export default function HomePage() {
    //hooks
    const {isLoading, items: posts, hasMoreItem, loadMoreItem} = useGetInfiniteListQuery<Post>(useGetFeedPostsQuery)

    const [scrollBottomRef] = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: hasMoreItem,
        onLoadMore: loadMoreItem,
    })
    console.log(posts)
    return (
        <div className=" pt-6 mb-6">
            <CreatePostForm/>

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
