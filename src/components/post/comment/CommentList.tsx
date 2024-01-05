import React, { FormEvent, useState } from 'react'
import Avatar from "@components/global/Avatar"
import CommentItem from "@components/post/comment/CommentItem"
import { useCreateCommentMutation, useGetCommentsQuery } from "@services/commentsApi"
import BasicInput from "@components/form/BasicInput"
import useAuthState from "@hooks/useAuthState"
import Loader from "@components/global/Loader"
import Error from "@components/global/Error"
import { ErrorResponse } from "@interfaces/index.interfaces"
import { IconButton } from '@mui/material'
import { MdSend as SendIcon } from "react-icons/md"
import { Post } from "@interfaces/posts.interfaces"
import { Button } from '@mui/material'

interface Props {
    post: Post
}

export default function CommentList( { post }: Props ) {
    const [ page, setPage ]                      = useState(1)
    const { user: currentUser, isAuthenticated } = useAuthState()
    const commentsQuery                          = useGetCommentsQuery({ postId: post.id, page })
    const [ createComment ]                      = useCreateCommentMutation()

    const [ commentBody, setCommentBody ] = useState('')

    const { isLoading, isError, isSuccess, data: commentsData } = commentsQuery
    const { items: comments = [], nextPage }                    = commentsData || {}
    const error                                                 = ( commentsQuery.error || {} ) as ErrorResponse

    async function handleSaveComment( event: FormEvent ) {
        event.preventDefault()
        if ( !commentBody ) return

        try {
            await createComment({ postId: post.id, body: commentBody }).unwrap()
            setCommentBody('')
        } catch ( err ) {
            console.error(err)
        }
    }

    //decide content
    let content = null
    if ( isLoading ) {
        content = <Loader/>
    } else if ( isSuccess && comments.length === 0 ) {
        content = <p className="mt-3">No comments</p>
    } else if ( isError ) {
        content = <Error message={ error.data?.message }/>
    } else if ( isSuccess && comments.length > 0 ) {
        content = comments.map(( comment ) => <CommentItem comment={ comment } post={ post } key={ comment.id }/>)
    }

    return (
        <div className="mt-2">
            { isAuthenticated && (
                <form onSubmit={ handleSaveComment } className="mb-2 flex items-center">
                    <Avatar src={ currentUser?.avatar?.url } online/>
                    <div className="relative ml-2 w-full">
                        <BasicInput
                            label="Write a comment..."
                            labelHide
                            type="text"
                            value={ commentBody }
                            className="rounded-full"
                            wrapperClassname="mb-0 md:mb-0"
                            onChange={ ( e ) => setCommentBody(e.target.value) }
                            autoComplete='off'
                        />
                        <div className="absolute top-[50%] right-[8px] translate-y-[-50%]">
                            <IconButton
                                type="submit"
                                disabled={ isLoading || !commentBody }
                                sx={{
                                    color: (theme) => theme.palette.secondary.main,
                                    '&:disabled': '#ddd'
                                }}
                            >
                                <SendIcon fontSize={ 20 } className="ml-1"/>
                            </IconButton>
                        </div>
                    </div>
                </form>
            ) }

            { content }

            { nextPage ? (
                <div className="mt-3">
                    { isLoading ? (
                        <Loader/>
                    ) : (
                        <Button onClick={ () => setPage(nextPage!) }>
                            See more comments
                        </Button>
                    ) }
                </div>
            ) : null }

        </div>
    )
}