"use client"
import React from 'react'
import PostCard from "@components/post/PostCard"
import { Post } from "@interfaces/posts.interfaces"
import { useGetPostByIdQuery } from "@services/postsApi"

export default function SinglePostPage( { post: initialPost }: { post: Post } ){
    const { data: post = initialPost } = useGetPostByIdQuery( initialPost.id )

    return (
        <PostCard post={ post! } initialCommentsVisible={ true }/>
    )
}