import React, { MouseEvent } from 'react'
import { BsHeartFill as LikeIcon } from "react-icons/bs"
import { BsHeart as OutlinedLikeIcon } from "react-icons/bs"
import { FaRegComment as CommentIcon } from "react-icons/fa"
import { Post } from "@interfaces/posts.interfaces"
import { usePostLikeMutation, usePostUnlikeMutation } from "@services/postsApi"
import { motion } from "framer-motion"
import { IconButton } from '@mui/material'
import PostShare from "@components/post/PostShare"
import useAuthState from "@hooks/useAuthState"
import useUnauthorizedAlert from "@hooks/useUnauthorzedAlert"


interface PostBarProps {
    post: Post
    isCommentsShow: boolean
    setIsCommentsShow: ( _: boolean ) => void
}

export default function PostBar( { post, setIsCommentsShow, isCommentsShow }: PostBarProps ) {
    //hooks
    const [ postLike ]        = usePostLikeMutation()
    const [ postUnlike ]      = usePostUnlikeMutation()
    const { isAuthenticated } = useAuthState()
    const unauthorizedAlert   = useUnauthorizedAlert()

    const { author, id, isViewerLiked, commentsCount, likesCount } = post

    function handlePostLike( event: MouseEvent<HTMLButtonElement> ) {
        event.currentTarget.disabled = true

        if ( !isAuthenticated ) {
            unauthorizedAlert({
                title: 'Like a Post to share the love.',
                message: `Join ${ process.env.NEXT_PUBLIC_APP_NAME } now to let ${ author.fullName } know you like their Post.`
            })
            return
        }

        postLike({ postId: id, authorId: author.id })
    }

    function handlePostUnlike( event: MouseEvent<HTMLButtonElement> ) {
        event.currentTarget.disabled = true

        postUnlike({ postId: id, authorId: author.id })
    }

    return (
        <div
            className="flex mt-2 border-t-2 border-b-2 border-gray-100 py-1 border-solid border-l-0 border-r-0 justify-around">
            <div className="flex items-center relative">
                <motion.button
                    className="icon"
                    onClick={ handlePostUnlike }
                    initial={ { scale: 0 } }
                    animate={ { scale: isViewerLiked ? 1 : 0 } }
                    transition={ { duration: 0.1 } }
                >
                    <LikeIcon fontSize="medium" color="#FF1493"/>
                </motion.button>

                <motion.button
                    className="icon absolute left-0"
                    onClick={ handlePostLike }
                    initial={ { scale: 0 } }
                    animate={ { scale: !isViewerLiked ? 1 : 0 } }
                    transition={ { duration: 0.1 } }
                >
                    <OutlinedLikeIcon fontSize="medium"/>
                </motion.button>

                <motion.p
                    key={ likesCount }
                    initial={ { y: -20, opacity: 0 } }
                    animate={ { y: 0, opacity: 1 } }
                    exit={ { opacity: 0, y: 20 } }
                    transition={ { duration: 0.3 } }
                    className="text-gray-600"
                >
                    { likesCount }
                </motion.p>
            </div>
            <div className="flex items-center">
                <IconButton onClick={ () => setIsCommentsShow(!isCommentsShow) }>
                    <CommentIcon size="18"/>
                </IconButton>
                <p className="text-gray-600">{ commentsCount }</p>
            </div>

            <PostShare post={ post }/>
        </div>
    )
}