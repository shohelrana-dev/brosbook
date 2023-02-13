import React, { useState } from 'react'
import Link from "next/link"
import { BsHeartFill as LikeIcon } from "react-icons/bs"
import { BsHeart as OutlinedLikeIcon } from "react-icons/bs"
import ShowMoreText from "react-show-more-text"

import Avatar from "@components/global/Avatar"
import { Comment, Post } from "@interfaces/posts.interfaces"
import { useLikeCommentMutation, useUnlikeCommentMutation } from "@services/commentsApi"
import timeAgo from "@utils/timeAgo"
import { motion } from "framer-motion"
import CommentOptions from "@components/post/CommentOptions"
import useAuthState from "@hooks/useAuthState"
import useUnauthorizedAlert from "@hooks/useUnauthorzedAlert"

interface Props {
    comment: Comment
    post: Post
}

function CommentItem( props: Props ){
    //hooks
    const [comment, setComment]             = useState<Comment | null>( props.comment )
    const [likeComment]                     = useLikeCommentMutation()
    const [unlikeComment]                   = useUnlikeCommentMutation()
    const [isViewerLiked, setIsViewerLiked] = useState<boolean>( comment?.isViewerLiked! )
    const [likesCount, setLikeCount]        = useState<number>( comment?.likesCount || 0 )
    const { isAuthenticated }               = useAuthState()
    const unauthorizedAlert                 = useUnauthorizedAlert()

    async function handleCommentLike(){
        if( ! isAuthenticated ){
            unauthorizedAlert( {
                title: 'Like a Comment to share the love.',
                message: `Join ${ process.env.NEXT_PUBLIC_APP_NAME } now to let ${ comment?.author.fullName } know you like their Post and Comment.`
            } )
            return
        }

        try {
            await likeComment( { postId: comment?.postId!, commentId: comment?.id! } ).unwrap()
            setIsViewerLiked( true )
            setLikeCount( likesCount + 1 )
        } catch ( err ) {
            console.error( err )
        }
    }

    async function handleCommentUnlike(){
        try {
            await unlikeComment( { postId: comment?.postId!, commentId: comment?.id! } ).unwrap()
            setIsViewerLiked( false )
            setLikeCount( likesCount - 1 )
        } catch ( err ) {
            console.error( err )
        }
    }

    if( ! comment ) return null

    return (
        <div className="flex">
            <Link href={ `/${ comment.author.username }` } className="mt-3">
                <Avatar src={ comment.author.avatar?.url } size="small"/>
            </Link>
            <div>
                <div className="flex items-center">
                    <div className="ml-2 mt-1 py-2 px-4 rounded-xl bg-theme-gray relative">
                        <Link href={ `/${ comment.author.username }` } className="flex flex-wrap">
                            <h3 className="text-xs font-medium">
                                { comment.author.fullName }
                            </h3>
                            <p className="text-xs ml-1 text-gray-500">@{ comment.author.username }</p>
                        </Link>

                        <div>
                            <div className="text-sm text-gray-700">
                                <ShowMoreText
                                    lines={ 3 }
                                    more={ <span className="text-blue-600">See more</span> }
                                    less={ <span className="text-blue-600">See less</span> }
                                    expanded={ false }
                                    truncatedEndingComponent={ "... " }
                                >
                                    { comment.body }
                                </ShowMoreText>
                            </div>
                        </div>
                    </div>
                    <CommentOptions comment={ comment } setComment={ setComment } post={ props.post }/>
                </div>

                <div className="flex items-center text-pink-500 relative">
                    <motion.button
                        onClick={ handleCommentUnlike }
                        className="icon"
                        initial={ { scale: 0 } }
                        animate={ { scale: isViewerLiked ? 1 : 0 } }
                        transition={ { duration: 0.1 } }
                    >
                        <LikeIcon fontSize="small" color="#FF1493"/>
                    </motion.button>
                    <motion.button
                        onClick={ handleCommentLike }
                        className="icon absolute"
                        initial={ { scale: 0 } }
                        animate={ { scale: ! isViewerLiked ? 1 : 0 } }
                        transition={ { duration: 0.1 } }
                    >
                        <OutlinedLikeIcon fontSize="small"/>
                    </motion.button>
                    <p>{ likesCount }</p>
                    <p className="text-xs ml-5">
                        { timeAgo( comment.createdAt ) }
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CommentItem