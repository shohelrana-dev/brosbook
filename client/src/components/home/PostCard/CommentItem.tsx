import React, { useState }  from 'react'
import Link                 from "next/link"
import moment               from "moment"
import { Zoom }             from "@mui/material"
import FavoriteIcon         from "@mui/icons-material/Favorite"
import OutlinedFavoriteIcon from "@mui/icons-material/FavoriteBorderOutlined"

import Avatar                                               from "@components/common/Avatar"
import { Comment }                                          from "@interfaces/posts.interfaces"
import { useLikeCommentMutation, useUnlikeCommentMutation } from "@services/commentsApi";

interface CommentItemState {
    comment: Comment
}

function CommentItem( { comment }: CommentItemState ){
    //hooks
    const [likeComment]                               = useLikeCommentMutation()
    const [unlikeComment]                             = useUnlikeCommentMutation()
    const [hasCurrentUserLike, setHasCurrentUserLike] = useState<boolean>( comment.hasCurrentUserLike )
    const [likeCount, setLikeCount]                   = useState<number>( comment.likeCount || 0 )

    async function saveCommentLike(){
        try {
            await likeComment( { postId: comment.postId, commentId: comment.id } ).unwrap()
            setHasCurrentUserLike( true )
            setLikeCount( likeCount + 1 )
        } catch ( err ) {
            console.error( err )
        }
    }

    async function removeCommentLike(){
        try {
            await unlikeComment( { postId: comment.postId, commentId: comment.id } ).unwrap()
            setHasCurrentUserLike( false )
            setLikeCount( likeCount - 1 )
        } catch ( err ) {
            console.error( err )
        }
    }

    return (
        <div className="flex">
            <Link href={ `/${ comment.user.username }` }>
                <a className="mt-3">
                    <Avatar src={ comment.user.photo } size="small"/>
                </a>
            </Link>
            <div>
                <div className="ml-2 mt-1 py-2 px-4 rounded-xl bg-theme-gray relative">
                    <Link href={ `/${ comment.user.username }` }>
                        <a>
                            <h3 className="text-xs font-medium">
                                { comment.user.fullName }
                            </h3>
                        </a>
                    </Link>

                    <div>
                        <div className="text-sm text-gray-700">
                            { comment.content }
                        </div>
                    </div>
                </div>

                <div className="flex items-center text-pink-500 relative">
                    <Zoom in={ hasCurrentUserLike }>
                        <button onClick={ removeCommentLike }
                                className="mr-2 hover:bg-pink-100 rounded-full p-2 duration-300 absolute">
                            <FavoriteIcon fontSize="small"/>
                        </button>
                    </Zoom>
                    <Zoom in={ ! hasCurrentUserLike }>
                        <button onClick={ saveCommentLike }
                                className="mr-1 hover:bg-pink-100 rounded-full p-2 duration-300">
                            <OutlinedFavoriteIcon fontSize="small"/>
                        </button>
                    </Zoom>
                    <p>{ likeCount }</p>
                    <p className="text-xs ml-5">
                        { moment( comment.createdAt ).fromNow( true ) }
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CommentItem