import React, { FormEvent, useState } from 'react'

import Avatar from "@components/common/Avatar"
import CommentItem from "@components/post/CommentItem"
import { useCreateCommentMutation, useGetCommentsQuery } from "@services/commentsApi"
import { Comment } from "@interfaces/posts.interfaces"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import BasicInput from "@components/common/BasicInput"
import useAuthState from "@hooks/useAuthState"
import ButtonGray from "@components/common/ButtonGray"
import Loading from "@components/common/Loading"
import { useGetPostByIdQuery } from "@services/postsApi"

interface CommentListPost {
    postId: string
}

function CommentList( { postId }: CommentListPost ){
    const { user: currentUser } = useAuthState()
    const {
              isLoading,
              isFetching,
              items: comments,
              hasMoreItem,
              loadMoreItem,
              setItems
          }                     = useGetInfiniteListQuery<Comment>( useGetCommentsQuery, { postId } )
    const { data: post }        = useGetPostByIdQuery( postId )
    const [createComment]       = useCreateCommentMutation()

    const [commentBody, setCommentBody] = useState( '' )

    async function handleSaveComment( event: FormEvent ){
        event.preventDefault()
        if( ! commentBody ) return

        try {
            const comment = await createComment( { postId, body: commentBody } ).unwrap()
            setItems( ( prevState: Comment[] ) => (
                [comment, ...prevState]
            ) )
            setCommentBody( '' )
        } catch ( err ) {
            console.error( err )
        }
    }

    return (
        <div className="mt-2">
            <form onSubmit={ handleSaveComment } className="mb-2 flex items-center">
                <div className="mt-[-4px]">
                    <Avatar src={ currentUser?.avatar.url } online size="small"/>
                </div>
                <div className="ml-2 w-full">
                    <BasicInput
                        label="Write a comment..."
                        labelHide
                        type="text"
                        value={ commentBody }
                        className="!rounded-full"
                        onChange={ ( e ) => setCommentBody( e.target.value ) }
                    />
                </div>
            </form>

            { ! isLoading ? comments?.length > 0 ? comments.map( ( comment: Comment ) => (
                <CommentItem comment={ comment } post={ post! } key={ comment.id }/>
            ) ) : (
                <p className="mt-3">No comments</p>
            ) : null }

            { isLoading || isFetching ? <Loading size={ 35 }/> : null }

            { hasMoreItem && ( ! isLoading && ! isFetching ) ? (
                <ButtonGray isLoading={ isLoading } onClick={ () => loadMoreItem() }>
                    See more comments
                </ButtonGray>
            ) : null }

        </div>
    )
}

export default CommentList