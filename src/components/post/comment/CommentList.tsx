import { FormEvent, useState } from 'react'
import { MdSend as SendIcon } from 'react-icons/md'
import BasicInput from '~/components/form/BasicInput'
import CommentItem from '~/components/post/comment/CommentItem'
import Avatar from '~/components/ui/Avatar'
import Error from '~/components/ui/Error'
import IconButton from '~/components/ui/IconButton'
import Loader from '~/components/ui/Loader'
import useAuth from '~/hooks/useAuth'
import { ErrorResponse } from '~/interfaces/index.interfaces'
import { Post } from '~/interfaces/posts.interfaces'
import { Button } from '~/lib/nextui'
import { useCreateCommentMutation, useGetCommentsQuery } from '~/services/commentsApi'

interface Props {
    post: Post
}

export default function CommentList({ post }: Props) {
    const [page, setPage] = useState(1)
    const { user: currentUser, isAuthenticated } = useAuth()
    const commentsQuery = useGetCommentsQuery({ postId: post.id, page })
    const [createComment] = useCreateCommentMutation()

    const [commentText, setCommentText] = useState('')

    const { isLoading, isError, isSuccess, data: commentsData } = commentsQuery
    const { items: comments = [], nextPage } = commentsData || {}
    const error = (commentsQuery.error || {}) as ErrorResponse

    async function handleSaveComment(event: FormEvent) {
        event.preventDefault()
        if (commentText) {
            setCommentText('')
            createComment({ postId: post.id, body: commentText })
        }
    }

    //decide content
    let content = null
    if (isLoading) {
        content = <Loader />
    } else if (isSuccess && comments.length === 0) {
        content = <p className='mt-3'>No comments</p>
    } else if (isError) {
        content = <Error message={error.data?.message} />
    } else if (isSuccess && comments.length > 0) {
        content = comments.map((comment) => (
            <CommentItem comment={comment} post={post} key={comment.id} />
        ))
    }

    return (
        <div className='mt-2'>
            {isAuthenticated && (
                <form onSubmit={handleSaveComment} className='mb-2 flex items-center'>
                    <Avatar src={currentUser?.avatar?.url} online />
                    <div className='relative ml-2 w-full'>
                        <BasicInput
                            placeholder='Write a comment...'
                            type='text'
                            radius='full'
                            value={commentText}
                            className='rounded-full'
                            wrapperClassname='mb-0 md:mb-0'
                            onValueChange={setCommentText}
                            autoComplete='off'
                        />
                        <div className='absolute top-1/2 right-2 right -translate-y-1/2'>
                            <IconButton
                                type='submit'
                                isDisabled={isLoading || !commentText}
                                className='text-primary'
                            >
                                <SendIcon fontSize={20} className='ml-1' />
                            </IconButton>
                        </div>
                    </div>
                </form>
            )}

            {content}

            {nextPage ? (
                <div className='mt-3'>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <Button
                            color='primary'
                            size='sm'
                            radius='full'
                            onClick={() => setPage(nextPage!)}
                        >
                            See more comments
                        </Button>
                    )}
                </div>
            ) : null}
        </div>
    )
}
