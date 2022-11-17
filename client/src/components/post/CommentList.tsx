import React, {FormEvent, useState} from 'react'

import Avatar from "@components/common/Avatar"
import CommentItem from "@components/post/CommentItem"
import {useCreateCommentMutation, useGetCommentsQuery} from "@services/commentsApi"
import {Comment} from "@interfaces/posts.interfaces"
import {useGetInfiniteListQuery} from "@hooks/useGetInfiniteListQuery"
import BasicInput from "@components/common/BasicInput"
import useAuth from "@hooks/useAuth"
import ButtonGray from "@components/common/ButtonGray"

interface CommentListPost {
    postId: string
}

function CommentList({postId}: CommentListPost) {
    const {user: currentUser} = useAuth()
    const {isLoading, items: comments, hasMoreItem, loadMoreItem} = useGetInfiniteListQuery<Comment>(useGetCommentsQuery, {postId})
    const [createComment] = useCreateCommentMutation()

    const [commentBody, setCommentBody] = useState('')

    async function handleSaveComment(event: FormEvent) {
        event.preventDefault()
        if (!commentBody) return

        try {
            const comment = await createComment({postId, body: commentBody}).unwrap()
            comments.push(comment)
            setCommentBody('')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="mt-2">
            <form onSubmit={handleSaveComment} className="mb-2 flex items-center">
                <div className="w-1/12 mt-[-2px]">
                    <Avatar src={currentUser?.photo} online size="small"/>
                </div>
                <div className="ml-2 w-11/12">
                    <BasicInput
                        label="Write a comment..."
                        labelHide
                        type="text"
                        value={commentBody}
                        className="!rounded-full"
                        onChange={(e) => setCommentBody(e.target.value.trim())}
                    />
                </div>
            </form>

            {comments?.length > 0 ? comments.map(comment => (
                <CommentItem comment={comment} key={comment.id}/>
            )) : (
                <p className="mt-3">No comments</p>
            )}

            { hasMoreItem ? (
                <ButtonGray isLoading={isLoading} onClick={() => loadMoreItem()}>
                    See more comments
                </ButtonGray>
            ): null}

        </div>
    )
}

export default CommentList