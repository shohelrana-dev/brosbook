import React, { MouseEvent, useState } from 'react'
import { BsHeartFill as LikeIcon } from "react-icons/bs"
import { BsHeart as OutlinedLikeIcon } from "react-icons/bs"
import { FaRegComment as CommentIcon } from "react-icons/fa"
import { Post } from "@interfaces/posts.interfaces"
import { usePostLikeMutation, usePostUnlikeMutation } from "@services/postsApi"
import { motion, AnimatePresence } from "framer-motion"
import IconButton from "@components/common/IconButton"
import PostShare from "@components/post/PostShare"
import useAuthState from "@hooks/useAuthState"
import Modal from "@components/common/Modal"
import Button from "@components/common/Button"
import Link from "next/link"
import ButtonOutline from "@components/common/ButtonOutline"
import { usePathname } from "next/navigation"


interface PostBarProps {
    post: Post
    setPost: ( post: Post ) => void
    isCommentsShow: boolean
    setIsCommentsShow: ( _: boolean ) => void
}

function PostBar( { post, setPost, setIsCommentsShow, isCommentsShow }: PostBarProps ){
    //hooks
    const [postLike]                                                    = usePostLikeMutation()
    const [postUnlike]                                                  = usePostUnlikeMutation()
    const { isAuthenticated }                                           = useAuthState()
    const [isUnauthorizedUserClickLike, setIsUnauthorizedUserClickLike] = useState<boolean>( false )
    const pathname                                                      = usePathname()

    async function handlePostLike( event: MouseEvent<HTMLButtonElement> ){
        event.currentTarget.disabled = true

        if( ! isAuthenticated ){
            setIsUnauthorizedUserClickLike( true )
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
        <>
            <Modal isOpen={ isUnauthorizedUserClickLike } onClose={ () => setIsUnauthorizedUserClickLike( false ) }>
                <div className="h-full flex flex-col justify-center items-center text-center">
                    <div className="mb-4">
                        <LikeIcon fontSize="50" color="#FF1493"/>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-xl md:text-2xl mb-2">Like a Post to share the love.</h3>
                        <p className="text-gray-700">Join { process.env.NEXT_PUBLIC_APP_NAME } now to
                            let { post.author.fullName } know you like
                            their
                            Post.</p>
                    </div>
                    <Link href={ `/auth/login?redirect_path=${ pathname }` } className="mb-3 w-full">
                        <Button size="lg" className="w-full">Log in</Button>
                    </Link>
                    <Link href="/auth/signup" className="w-full">
                        <ButtonOutline size="lg" className="w-full">Sign up</ButtonOutline>
                    </Link>
                </div>
            </Modal>
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
        </>
    )
}

export default PostBar