import React, { useState } from 'react'
import Link from "next/link"
import {BsHeartFill as LikeIcon} from "react-icons/bs"
import {BsHeart as OutlinedLikeIcon} from "react-icons/bs"

import Avatar from "@components/common/Avatar"
import { Comment } from "@interfaces/posts.interfaces"
import { useLikeCommentMutation, useUnlikeCommentMutation } from "@services/commentsApi"
import timeAgo from "@utils/timeAgo"
import {BsThreeDots as ThreeDotsIcon} from "react-icons/bs"
import {motion} from "framer-motion"
import IconButton from "@components/common/IconButton"

interface CommentItemState {
    comment: Comment
}

function CommentItem({ comment }: CommentItemState) {
    //hooks
    const [likeComment] = useLikeCommentMutation()
    const [unlikeComment] = useUnlikeCommentMutation()
    const [isViewerLiked, setIsViewerLiked] = useState<boolean>(comment.isViewerLiked)
    const [likeCount, setLikeCount] = useState<number>(comment.likeCount || 0)

    async function handleCommentLike() {
        try {
            await likeComment({ postId: comment.postId, commentId: comment.id }).unwrap()
            setIsViewerLiked(true)
            setLikeCount(likeCount + 1)
        } catch (err) {
            console.error(err)
        }
    }

    async function handleCommentUnlike() {
        try {
            await unlikeComment({ postId: comment.postId, commentId: comment.id }).unwrap()
            setIsViewerLiked(false)
            setLikeCount(likeCount - 1)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="flex">
            <Link href={`/${comment.user.username}`} className="mt-3">
                <Avatar src={comment.user.avatar} size="small" />
            </Link>
            <div>
                <div className="flex items-center">
                    <div className="ml-2 mt-1 py-2 px-4 rounded-xl bg-theme-gray relative">
                        <Link href={`/${comment.user.username}`} className="flex">
                            <h3 className="text-xs font-medium">
                                {comment.user.fullName}
                            </h3>
                            <p className="text-xs ml-1 text-gray-500">@{comment.user.username}</p>
                        </Link>

                        <div>
                            <div className="text-sm text-gray-700">
                                {comment.body}
                            </div>
                        </div>
                    </div>
                    <IconButton className="ml-2">
                        <ThreeDotsIcon size="18" />
                    </IconButton>
                </div>

                <div className="flex items-center text-pink-500 relative">
                    <motion.button
                        onClick={handleCommentUnlike}
                        className="icon"
                        initial={{scale: 0}}
                        animate={{scale: isViewerLiked ? 1 : 0}}
                        transition={{duration: 0.1}}
                    >
                        <LikeIcon fontSize="small" color="#FF1493"/>
                    </motion.button>
                    <motion.button
                        onClick={handleCommentLike}
                        className="icon absolute"
                        initial={{scale: 0}}
                        animate={{scale: !isViewerLiked ? 1 : 0}}
                        transition={{duration: 0.1}}
                    >
                        <OutlinedLikeIcon fontSize="small"/>
                    </motion.button>
                    <p>{likeCount}</p>
                    <p className="text-xs ml-5">
                        {timeAgo(comment.createdAt)}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CommentItem