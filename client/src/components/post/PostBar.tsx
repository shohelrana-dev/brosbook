import React, {MouseEvent, useState} from 'react'
import {Zoom} from "@mui/material"
import LikeIcon from "@mui/icons-material/Favorite"
import OutlinedLikeIcon from "@mui/icons-material/FavoriteBorderOutlined"
import {FaRegComment as CommentIcon, FaShareSquare as ShareIcon} from "react-icons/fa"
import {Post} from "@interfaces/posts.interfaces"
import {usePostLikeMutation, usePostUnlikeMutation} from "@services/postsApi"

interface PostBarProps{
    post: Post
    setShowComment: (_:boolean) => void
    showComment: boolean
}

function PostBar({post, setShowComment, showComment}: PostBarProps) {
    //hooks
    const [postLike] = usePostLikeMutation()
    const [postUnlike] = usePostUnlikeMutation()

    const [hasCurrentUserLike, setHasCurrentUserLike] = useState<boolean>(post.hasCurrentUserLike)
    const [likeCount, setLikeCount] = useState<number>(post.likeCount)

    async function handlePostLike(event: MouseEvent<HTMLButtonElement>) {
        event.currentTarget.disabled = true

        try {
            await postLike(post.id).unwrap()
            setHasCurrentUserLike(true)
            setLikeCount(likeCount + 1)
        } catch (err) {
            console.error(err)
        }
    }

    async function handlePostUnlike(event: MouseEvent<HTMLButtonElement>) {
        event.currentTarget.disabled = true

        try {
            await postUnlike(post.id).unwrap()
            setHasCurrentUserLike(false)
            setLikeCount(likeCount - 1)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="flex mt-2 border-t-2 border-b-2 border-gray-100 py-1 border-solid justify-around">
            <div className="flex items-center relative">
                <Zoom in={hasCurrentUserLike}>
                    <button
                        onClick={handlePostUnlike}
                        className="icon absolute"
                    >
                        <LikeIcon fontSize="small" />
                    </button>
                </Zoom>
                <Zoom in={!hasCurrentUserLike}>
                    <button
                        onClick={handlePostLike}
                        className="icon"
                    >
                        <OutlinedLikeIcon fontSize="small" />
                    </button>
                </Zoom>
                <p className="text-gray-600">{likeCount}</p>
            </div>
            <div className="flex items-center">
                <button className="icon" onClick={() => setShowComment(!showComment)}>
                    <CommentIcon size="18" />
                </button>
                <p className="text-gray-600">{post.commentCount}</p>
            </div>
            <div className="flex items-center text-gray-600">
                <button className="icon">
                    <ShareIcon size="18" />
                </button>
            </div>
        </div>
    )
}

export default PostBar