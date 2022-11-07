import React, { useState } from 'react'
import Link from "next/link"
import { BsThreeDots as ThreeDotsIcon } from 'react-icons/bs'

import Avatar from "@components/common/Avatar"
import { Post } from "@interfaces/posts.interfaces"
import CommentList from "@components/post/CommentList"
import timeAgo from "@utils/timeAgo"
import LightboxImage from '@components/common/LightboxImage'
import PostBar from "@components/post/PostBar"

interface PostCardProps {
    post: Post
}

const PostCard = ({ post }: PostCardProps) => {
    //hooks
    const [showComment, setShowComment] = useState<boolean>(false)

    return (
        <div className="box p-6 mt-6" id={`post-${post.id}`}>
            <div className="flex">
                <Link href={`/${post.user.username}`}>
                    <Avatar src={post.user.photo} />
                </Link>
                <div className="ml-4 w-full">
                    <div className="relative">
                        <Link href={`/${post.user.username}`}>
                            <h3 className="text-md font-medium">
                                {post.user.fullName}
                                <span className="ml-2 text-gray-600 font-normal">@{post.user.username}</span>
                            </h3>
                        </Link>
                        <div className="icon absolute top-0 right-0">
                            <ThreeDotsIcon size="18" />
                        </div>
                    </div>

                    <p className="text-gray-500 font-medium text-xs">
                        {timeAgo(post.createdAt)}
                    </p>

                </div>
            </div>
            <div>
                {post.body && (
                    <div className="my-1">
                        {post.body}
                    </div>
                )}
                {post.photo && (
                    <div className="my-3">
                        <LightboxImage src={post.photo} width="500" height="340"  alt="Post image"/>
                    </div>
                )}

                <PostBar post={post} showComment={showComment} setShowComment={setShowComment}/>

                <CommentList postId={post.id} showComment={showComment} />

            </div>
        </div>
    )
}

export default PostCard
