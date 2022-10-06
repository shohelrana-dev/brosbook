import React, { FormEvent, useEffect, useState } from 'react'
import { CircularProgress }                      from "@mui/material"

import Avatar                                            from "@components/common/Avatar"
import CommentsSkeleton                                  from "@components/home/Skeletons/CommentsSkeleton"
import CommentItem                                       from "@components/home/PostCard/CommentItem"
import { useCreateCommentMutation, useGetCommentsQuery } from "@services/commentsApi"
import { Comment }                                       from "@interfaces/posts.interfaces"
import { useSelector }                                   from "react-redux"
import { selectAuthState }                               from "@features/authSlice"

interface CommentListPost {
    postId: number
    isShowComment: boolean
}

function CommentList( { postId, isShowComment }: CommentListPost ){
    const [page, setPage]                     = useState<number>( 1 )
    const { isLoading, data: comments }       = useGetCommentsQuery( { page, postId } )
    const [createComment]                     = useCreateCommentMutation()
    const [commentItems, setCommentItems]     = useState<Comment[]>( [] )
    const { user: currentUser }               = useSelector( selectAuthState )
    const [commentContent, setCommentContent] = useState( '' )

    async function handleSaveComment( event: FormEvent ){
        event.preventDefault()
        if( ! commentContent ) return

        try {
            const comment = await createComment( { postId, content: commentContent } ).unwrap()
            setCommentItems( [...commentItems, comment] )
            setCommentContent( '' )
        } catch ( err ) {
            console.error( err )
        }
    }

    useEffect( () => setCommentItems( [...commentItems, ...comments?.items! || []] ), [comments] )

    return (
        <div className="mt-2">
            <form onSubmit={ handleSaveComment } className="mb-2 flex items-center">
                <Avatar src={ currentUser.photo } online size="small"/>
                <input onChange={ ( e ) => setCommentContent( e.target.value.trim() ) } type="text" name="comment"
                       value={ commentContent }
                       className="input-basic rounded-full bg-theme-gray ml-2"
                       placeholder="Write a comment..."/>
            </form>

            { isShowComment && ( commentItems.length > 0 ? commentItems.map( comment => (
                <CommentItem comment={ comment } key={ comment.id }/>
            ) ) : (
                <p className="mt-3">No comments</p>
            ) ) }

            { isShowComment && !! comments?.nextPage && (
                <button
                    className="button mt-2 py-2 disabled:cursor-default min-w-[150px]"
                    disabled={ isLoading }
                    onClick={ () => setPage( comments?.nextPage! ) }
                >
                    { isLoading ? <CircularProgress size={ 16 }/> : 'See more comments' }
                </button>
            ) }

            { isLoading && <CommentsSkeleton/> }

        </div>
    )
}

export default CommentList