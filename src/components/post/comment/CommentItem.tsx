import Link from 'next/link'
import ShowMoreText from 'react-show-more-text'

import Avatar from '~/components/global/Avatar'
import LikeButton from '~/components/post/LikeButton'
import LikesCount from '~/components/post/LikesCount'
import CommentOptions from '~/components/post/comment/CommentOptions'
import useSession from '~/hooks/useSession'
import useUnauthorizedAlert from '~/hooks/useUnauthorzedAlert'
import { Comment, Post } from '~/interfaces/posts.interfaces'
import { useLikeCommentMutation, useUnlikeCommentMutation } from '~/services/commentsApi'
import siteMetadata from '~/utils/siteMetadata'
import timeAgo from '~/utils/timeAgo'

interface Props {
    comment: Comment
    post: Post
}

export default function CommentItem({ post, comment }: Props) {
    //hooks
    const [likeComment] = useLikeCommentMutation()
    const [unlikeComment] = useUnlikeCommentMutation()
    const { user: currentUser, isLoggedIn } = useSession()
    const unauthorizedAlert = useUnauthorizedAlert()

    const { id, body, isViewerLiked, likesCount, author, createdAt } = comment
    const isCurrentUserAuthor =
        isLoggedIn && author && (author.id === currentUser?.id || post.author.id === currentUser?.id)

    async function handleCommentLike() {
        if (!isLoggedIn) {
            unauthorizedAlert({
                title: 'Like a Comment to share the love.',
                message: `Join ${siteMetadata.appName} now to let ${author.fullName} know you like their Post and Comment.`,
            })
            return
        }

        likeComment({ postId: post.id, commentId: id })
    }

    async function handleCommentUnlike() {
        unlikeComment({ postId: post.id, commentId: id })
    }

    return (
        <div className='flex flex-wrap'>
            <Link href={`/${author.username}`} className='mt-3'>
                <Avatar src={author.avatar?.url} size='small' />
            </Link>
            <div>
                <div className='flex items-center'>
                    <div className='ml-2 mt-1 py-2 px-4 rounded-xl bg-light-gray relative'>
                        <Link href={`/${author.username}`} className='flex'>
                            <h3 className='text-xs font-medium'>{author.fullName}</h3>
                            <p className='text-xs ml-1 text-gray-500'>@{author.username}</p>
                        </Link>

                        <div>
                            <div className='text-sm text-gray-700'>
                                <ShowMoreText
                                    lines={3}
                                    more={<span className='text-blue-600'>See more</span>}
                                    less={<span className='text-blue-600'>See less</span>}
                                    expanded={false}
                                    truncatedEndingComponent={'... '}
                                >
                                    {body}
                                </ShowMoreText>
                            </div>
                        </div>
                    </div>
                    <CommentOptions comment={comment} isCurrentUserAuthor={isCurrentUserAuthor} />
                </div>

                <div className='flex flex-wrap items-center relative'>
                    <LikeButton
                        isViewerLiked={isViewerLiked}
                        handleLike={handleCommentLike}
                        handleUnlike={handleCommentUnlike}
                        size='small'
                    />

                    <LikesCount isViewerLiked={isViewerLiked} likesCount={likesCount} />

                    <p className='text-xs ml-5 text-pink-700'>{timeAgo(createdAt)}</p>
                </div>
            </div>
        </div>
    )
}
