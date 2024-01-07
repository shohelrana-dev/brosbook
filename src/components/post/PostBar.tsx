import React, { MouseEvent } from 'react'
import { FaRegComment as CommentIcon } from 'react-icons/fa'
import { Post } from '@interfaces/posts.interfaces'
import { usePostLikeMutation, usePostUnlikeMutation } from '@services/postsApi'
import { IconButton, Tooltip } from '@mui/material'
import PostShare from '@components/post/PostShare'
import useAuthState from '@hooks/useAuthState'
import useUnauthorizedAlert from '@hooks/useUnauthorzedAlert'
import LikeButton from '@components/post/LikeButton'
import LikesCount from '@components/post/LikesCount'

interface PostBarProps {
    post: Post
    isCommentsShow: boolean
    setIsCommentsShow: (_: boolean) => void
}

export default function PostBar({ post, setIsCommentsShow, isCommentsShow }: PostBarProps) {
    //hooks
    const [postLike] = usePostLikeMutation()
    const [postUnlike] = usePostUnlikeMutation()
    const { isAuthenticated } = useAuthState()
    const unauthorizedAlert = useUnauthorizedAlert()

    const { author, id, isViewerLiked, commentsCount, likesCount } = post

    function handlePostLike(event: MouseEvent<HTMLButtonElement>) {
        event.currentTarget.disabled = true

        if (!isAuthenticated) {
            unauthorizedAlert({
                title: 'Like a Post to share the love.',
                message: `Join ${process.env.NEXT_PUBLIC_APP_NAME} now to let ${author.fullName} know you like their Post.`,
            })
            return
        }

        postLike({ postId: id, authorId: author.id })

        event.currentTarget.disabled = false
    }

    function handlePostUnlike(event: MouseEvent<HTMLButtonElement>) {
        event.currentTarget.disabled = true

        postUnlike({ postId: id, authorId: author.id })

        event.currentTarget.disabled = false
    }

    return (
        <div className='flex flex-wrap mt-2 border-x-0 border-y border-solid border-gray-200 py-1 justify-around'>
            <div className='flex flex-wrap items-center gap-1'>
                <LikeButton
                    isViewerLiked={isViewerLiked}
                    handleLike={handlePostLike}
                    handleUnlike={handlePostUnlike}
                />

                <LikesCount
                    isViewerLiked={isViewerLiked}
                    likesCount={likesCount}
                />
            </div>
            <div className='flex flex-wrap items-center'>
                <Tooltip title='Comments'>
                    <IconButton onClick={() => setIsCommentsShow(!isCommentsShow)}>
                        <CommentIcon size='18' />
                    </IconButton>
                </Tooltip>
                <p className='text-gray-600'>{commentsCount}</p>
            </div>

            <PostShare post={post} />
        </div>
    )
}
