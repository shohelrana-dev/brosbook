import React, { FormEvent, useState } from 'react'

import Avatar from "@components/common/Avatar"
import CommentItem from "@components/post/CommentItem"
import { useCreateCommentMutation, useGetCommentsQuery } from "@services/commentsApi"
import { Comment } from "@interfaces/posts.interfaces"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import BasicInput from "@components/common/BasicInput"
import useCurrentUser from "@hooks/useCurrentUser"
import ButtonGray from "@components/common/ButtonGray"
import Loading from "@components/common/Loading"

interface CommentListPost {
    postId: string
}

function CommentList( { postId }: CommentListPost ){
    const { user: currentUser } = useCurrentUser()
    const {
              isLoading,
              items: comments,
              hasMoreItem,
              loadMoreItem,
              setItems
          }                     = useGetInfiniteListQuery<Comment>( useGetCommentsQuery, { postId } )
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
                <CommentItem comment={ comment } key={ comment.id }/>
            ) ) : (
                <p className="mt-3">No comments</p>
            ) : null }

            { isLoading ? <Loading size={30}/> : null }

            { hasMoreItem ? (
                <ButtonGray isLoading={ isLoading } onClick={ () => loadMoreItem() }>
                    See more comments
                </ButtonGray>
            ) : null }

        </div>
    )
}

export default CommentList