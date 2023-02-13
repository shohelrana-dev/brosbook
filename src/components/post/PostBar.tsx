import React, { MouseEvent } from 'react'
import { BsHeartFill as LikeIcon } from "react-icons/bs"
import { BsHeart as OutlinedLikeIcon } from "react-icons/bs"
import { FaRegComment as CommentIcon } from "react-icons/fa"
import { Post } from "@interfaces/posts.interfaces"
import { usePostLikeMutation, usePostUnlikeMutation } from "@services/postsApi"
import { motion, AnimatePresence } from "framer-motion"
import IconButton from "@components/global/IconButton"
import PostShare from "@components/post/PostShare"
import useAuthState from "@hooks/useAuthState"
import useUnauthorizedAlert from "@hooks/useUnauthorzedAlert"


interface PostBarProps {
    post: Post
    setPost: ( post: Post ) => void
    isCommentsShow: boolean
    setIsCommentsShow: ( _: boolean ) => void
}

function PostBar( { post, setPost, setIsCommentsShow, isCommentsShow }: PostBarProps ){
    //hooks
    const [postLike]          = usePostLikeMutation()
    const [postUnlike]        = usePostUnlikeMutation()
    const { isAuthenticated } = useAuthState()
    const unauthorizedAlert   = useUnauthorizedAlert()

    async function handlePostLike( event: MouseEvent<HTMLButtonElement> ){
        event.currentTarget.disabled = true

        if( ! isAuthenticated ){
            unauthorizedAlert( {
                title: 'Like a Post to share the love.',
                message: `Join ${ process.env.NEXT_PUBLIC_APP_NAME } now to let ${ post.author.fullName } know you like their Post.`
            } )
            return
        }

        try {
            const likedPost = await postLike( post.id ).unwrap()
            setPost( likedPost )
        } catch ( err ) {
            console.error( err )
        }
    }

    async function handlePostUnlike( event: MouseEvent<HTMLButtonElement> ){
        event.currentTarget.disabled = true

        try {
            const unlikedPost = await postUnlike( post.id ).unwrap()
            setPost( unlikedPost )
        } catch ( err ) {
            console.error( err )
        }
    }

    return (
        <div className="flex mt-2 border-t-2 border-b-2 border-gray-100 py-1 border-solid justify-around">
            <div className="flex items-center relative">
                <AnimatePresence>
                    <>
                        <motion.button
                            onClick={ handlePostUnlike }
                            className="icon"
                            initial={ { scale: 0 } }
                            animate={ { scale: post.isViewerLiked ? 1 : 0 } }
                            transition={ { duration: 0.1 } }
                        >
                            <LikeIcon fontSize="medium" color="#FF1493"/>
                        </motion.button>
                        <motion.button
                            onClick={ handlePostLike }
                            className="icon absolute"
                            initial={ { scale: 0 } }
                            animate={ { scale: ! post.isViewerLiked ? 1 : 0 } }
                            transition={ { duration: 0.1 } }
                        >
                            <OutlinedLikeIcon fontSize="medium"/>
                        </motion.button>
                        <motion.p
                            key={ post.likesCount }
                            initial={ { y: -10, opacity: 0 } }
                            animate={ { y: 0, opacity: 1 } }
                            transition={ { duration: 0.3 } }
                            className="text-gray-600">
                            { post.likesCount }
                        </motion.p>
                    </>
                </AnimatePresence>
            </div>
            <div className="flex items-center">
                <IconButton onClick={ () => setIsCommentsShow( ! isCommentsShow ) }>
                    <CommentIcon size="18"/>
                </IconButton>
                <p className="text-gray-600">{ post.commentsCount }</p>
            </div>

            <PostShare post={ post }/>
        </div>
    )
}

export default PostBar