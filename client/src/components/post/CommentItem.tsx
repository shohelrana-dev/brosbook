import React, { useState } from 'react'
import Link from "next/link"
import { Zoom } from "@mui/material"
import LikeIcon from "@mui/icons-material/Favorite"
import OutlinedLikeIcon from "@mui/icons-material/FavoriteBorderOutlined"

import Avatar from "@components/common/Avatar"
import { Comment } from "@interfaces/posts.interfaces"
import { useLikeCommentMutation, useUnlikeCommentMutation } from "@services/commentsApi"
import timeAgo from "@utils/timeAgo"
import {BsThreeDots as ThreeDotsIcon} from "react-icons/bs"

interface CommentItemState {
    comment: Comment
}

function CommentItem({ comment }: CommentItemState) {
    //hooks
    const [likeComment] = useLikeCommentMutation()
    const [unlikeComment] = useUnlikeCommentMutation()
    const [hasCurrentUserLike, setHasCurrentUserLike] = useState<boolean>(comment.hasCurrentUserLike)
    const [likeCount, setLikeCount] = useState<number>(comment.likeCount || 0)

    async function saveCommentLike() {
        try {
            await likeComment({ postId: comment.postId, commentId: comment.id }).unwrap()
            setHasCurrentUserLike(true)
            setLikeCount(likeCount + 1)
        } catch (err) {
            console.error(err)
        }
    }

    async function removeCommentLike() {
        try {
            await unlikeComment({ postId: comment.postId, commentId: comment.id }).unwrap()
            setHasCurrentUserLike(false)
            setLikeCount(likeCount - 1)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="flex">
            <Link href={`/${comment.user.username}`} className="mt-3">
                <Avatar src={comment.user.photo} size="small" />
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
                    <button className="icon h-[35px] ml-2">
                        <ThreeDotsIcon size="18" />
                    </button>
                </div>

                <div className="flex items-center text-pink-500 relative">
                    <Zoom in={hasCurrentUserLike}>
                        <button onClick={removeCommentLike} className="icon absolute">
                            <LikeIcon fontSize="small" />
                        </button>
                    </Zoom>
                    <Zoom in={!hasCurrentUserLike}>
                        <button onClick={saveCommentLike} className="icon">
                            <OutlinedLikeIcon fontSize="small" />
                        </button>
                    </Zoom>
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