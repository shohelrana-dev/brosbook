import React, {FormEvent, useState} from 'react'
import {CircularProgress} from "@mui/material"

import Avatar from "@components/common/Avatar"
import CommentItem from "@components/post/CommentItem"
import {useCreateCommentMutation, useGetCommentsQuery} from "@services/commentsApi"
import {Comment} from "@interfaces/posts.interfaces"
import {useSelector} from "react-redux"
import {selectAuthState} from "@slices/authSlice"
import {useGetInfiniteListQuery} from "@hooks/useGetInfiniteListQuery";

interface CommentListPost {
    postId: string
    showComment: boolean
}

function CommentList({postId, showComment}: CommentListPost) {
    const {user: currentUser} = useSelector(selectAuthState)
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
                <Avatar src={currentUser.photo} online size="small"/>
                <input onChange={(e) => setCommentBody(e.target.value.trim())} type="text" name="comment"
                       value={commentBody}
                       className="input-basic rounded-full bg-theme-gray ml-2"
                       placeholder="Write a comment..."/>
            </form>

            {showComment && (comments.length > 0 ? comments.map(comment => (
                <CommentItem comment={comment} key={comment.id}/>
            )) : (
                <p className="mt-3">No comments</p>
            ))}

            {showComment && hasMoreItem && (
                <button
                    className="button mt-2 py-2 disabled:cursor-default min-w-[150px]"
                    disabled={isLoading}
                    onClick={() => loadMoreItem()}
                >
                    {isLoading ? <CircularProgress size={16}/> : 'See more comments'}
                </button>
            )}

            {isLoading && <CircularProgress size={16}/>}

        </div>
    )
}

export default CommentList