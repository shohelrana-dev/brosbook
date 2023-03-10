import React from 'react'
import PostsLoader from "@components/loaders/PostsLoader"
import { Post } from "@interfaces/posts.interfaces"
import PostCard from "@components/post/PostCard"
import InfiniteScroll from "react-infinite-scroller"

interface Props {
    posts: Post[]
    loadMore: () => void
    hasMore: boolean
}

export default function PostList( { posts, loadMore, hasMore }: Props ){
    return (
        <InfiniteScroll
            loadMore={ loadMore }
            hasMore={ hasMore }
            loader={ <PostsLoader/> }
        >
            { posts.map( ( post: Post ) => (
                <PostCard post={ post } key={ post.id }/>
            ) ) }
        </InfiniteScroll>
    )
}