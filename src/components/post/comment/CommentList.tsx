import React, { FormEvent, useState } from 'react'
import Avatar from "@components/global/Avatar"
import CommentItem from "@components/post/comment/CommentItem"
import { useCreateCommentMutation, useGetCommentsQuery } from "@services/commentsApi"
import BasicInput from "@components/global/BasicInput"
import useAuthState from "@hooks/useAuthState"
import ButtonGray from "@components/global/ButtonGray"
import Loading from "@components/global/Loading"
import { useGetPostByIdQuery } from "@services/postsApi"
import Error from "@components/global/Error"
import { ErrorResponse } from "@interfaces/index.interfaces"
import IconButton from "@components/global/IconButton"
import { MdSend as SendIcon } from "react-icons/md"

interface CommentListPost {
    postId: string
}

function CommentList( { postId }: CommentListPost ){
    const [page, setPage]                        = useState( 1 )
    const { user: currentUser, isAuthenticated } = useAuthState()
    const commentsQuery                                                = useGetCommentsQuery( { postId, page } )
    const { data: post }        = useGetPostByIdQuery( postId )
    const [createComment]                        = useCreateCommentMutation()

    const [commentBody, setCommentBody] = useState( '' )

    const { isLoading, isError, isSuccess, data: commentsData } = commentsQuery
    const { items: comments = [], nextPage }                    = commentsData || {}
    const error                                                 = ( commentsQuery.error || {} ) as ErrorResponse

    async function handleSaveComment( event: FormEvent ){
        event.preventDefault()
        if( ! commentBody ) return

        try {
            await createComment( { postId, body: commentBody } ).unwrap()
            setCommentBody( '' )
        } catch ( err ) {
            console.error( err )
        }
    }

    //decide content
    let content = null
    if( isLoading ){
        content = <Loading size={ 35 }/>
    } else if( isSuccess && comments.length === 0 ){
        content = <p className="mt-3">No comments</p>
    } else if( isError ){
        content = <Error message={ error.data?.message }/>
    } else if( isSuccess && comments.length > 0 ){
        content = comments.map( ( comment ) => <CommentItem comment={ comment } post={ post! } key={ comment.id }/> )
    }

    return (
        <div className="mt-2">
            { isAuthenticated ? (
                <form onSubmit={ handleSaveComment } className="mb-2 flex items-center">
                    <div className="mt-[-4px]">
                        <Avatar src={ currentUser?.avatar?.url } online size="small"/>
                    </div>
                    <div className="relative ml-2 w-full">
                        <BasicInput
                            label="Write a comment..."
                            labelHide
                            type="text"
                            value={ commentBody }
                            className="!rounded-full"
                            onChange={ ( e ) => setCommentBody( e.target.value ) }
                        />
                        <div className="absolute top-[3px] right-[8px]">
                            <IconButton type="submit"
                                        className="text-theme-blue bg-transparent px-4 disabled:text-blue-400"
                                        disabled={ isLoading || ! commentBody }>
                                <SendIcon fontSize={ 20 } className="ml-1"/>
                            </IconButton>
                        </div>
                    </div>
                </form>
            ) : null }

            { content }

            { !! nextPage ? (
                <ButtonGray isLoading={ isLoading } onClick={ () => setPage( nextPage! ) }>
                    See more comments
                </ButtonGray>
            ) : null }

        </div>
    )
}

export default CommentList