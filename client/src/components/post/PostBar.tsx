import React, {MouseEvent, useState} from 'react'
import {BsHeartFill as LikeIcon} from "react-icons/bs"
import {BsHeart as OutlinedLikeIcon} from "react-icons/bs"
import {FaRegComment as CommentIcon, FaShareSquare as ShareIcon} from "react-icons/fa"
import {Post} from "@interfaces/posts.interfaces"
import {usePostLikeMutation, usePostUnlikeMutation} from "@services/postsApi"
import {motion, AnimatePresence} from "framer-motion"
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {toast} from "react-toastify"


interface PostBarProps {
    post: Post
    setPost: (post: Post) => void
    isCommentsHidden: boolean
    setIsCommentsHidden: (_: boolean) => void
}

function PostBar({post, setPost, setIsCommentsHidden, isCommentsHidden}: PostBarProps) {
    //hooks
    const [postLike] = usePostLikeMutation()
    const [postUnlike] = usePostUnlikeMutation()

    async function handlePostLike(event: MouseEvent<HTMLButtonElement>) {
        event.currentTarget.disabled = true

        try {
            const likedPost = await postLike(post.id).unwrap()
            setPost(likedPost)
        } catch (err) {
            console.error(err)
        }
    }

    async function handlePostUnlike(event: MouseEvent<HTMLButtonElement>) {
        event.currentTarget.disabled = true

        try {
            const unlikedPost = await postUnlike(post.id).unwrap()
            setPost(unlikedPost)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="flex mt-2 border-t-2 border-b-2 border-gray-100 py-1 border-solid justify-around">
            <div className="flex items-center relative">
                <AnimatePresence>
                    <motion.button
                        onClick={handlePostUnlike}
                        className="icon"
                        initial={{scale: 0}}
                        animate={{scale: post.isViewerLiked ? 1 : 0}}
                        transition={{duration: 0.1}}
                    >
                        <LikeIcon fontSize="medium" color="#FF1493"/>
                    </motion.button>
                    <motion.button
                        onClick={handlePostLike}
                        className="icon absolute"
                        initial={{scale: 0}}
                        animate={{scale: !post.isViewerLiked ? 1 : 0}}
                        transition={{duration: 0.1}}
                    >
                        <OutlinedLikeIcon fontSize="medium"/>
                    </motion.button>
                    <motion.p
                        key={post.likeCount}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{duration: 0.3}}
                        className="text-gray-600">
                        {post.likeCount}
                    </motion.p>
                </AnimatePresence>
            </div>
            <div className="flex items-center">
                <button className="icon" onClick={() => setIsCommentsHidden(!isCommentsHidden)}>
                    <CommentIcon size="18"/>
                </button>
                <p className="text-gray-600">{post.commentCount}</p>
            </div>
            <div className="flex items-center text-gray-600">
                <CopyToClipboard text={`${process.env.NEXT_PUBLIC_APP_URL}/${post.author.username}/posts/${post.id}`} onCopy={()=> toast.success('Link copied.')}>
                    <button className="icon">
                        <ShareIcon size="18"/>
                    </button>
                </CopyToClipboard>
            </div>
        </div>
    )
}

export default PostBar