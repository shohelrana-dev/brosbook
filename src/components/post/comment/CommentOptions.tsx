import { useState } from 'react'
import { AiOutlineUserAdd as FollowIcon } from 'react-icons/ai'
import { BsThreeDots as ThreeDotsIcon } from 'react-icons/bs'
import { RiDeleteBin5Line as DeleteIcon, RiUserUnfollowLine as UnfollowIcon } from 'react-icons/ri'
import { useConfirmAlert } from 'react-use-confirm-alert'
import { toast } from 'sonner'
import IconButton from '~/components/global/IconButton'
import Tooltip from '~/components/global/Tooltip'
import siteMetadata from '~/config/siteMetadata'
import useSession from '~/hooks/useSession'
import useUnauthorizedAlert from '~/hooks/useUnauthorzedAlert'
import { Comment } from '~/interfaces/posts.interfaces'
import { User } from '~/interfaces/user.interfaces'
import { Dropdown, DropdownItem, DropdownMenu, PopoverTrigger } from '~/lib/nextui'
import { useDeleteCommentMutation } from '~/services/commentsApi'
import { useFollowMutation, useUnfollowMutation } from '~/services/usersApi'

interface Props {
    isCurrentUserAuthor: boolean
    comment: Comment
}

export default function CommentOptions({ comment, isCurrentUserAuthor }: Props) {
    const [follow] = useFollowMutation()
    const [unfollow] = useUnfollowMutation()
    const [deleteComment] = useDeleteCommentMutation()

    const { isLoggedIn } = useSession()
    const confirmAlert = useConfirmAlert()
    const [author, setAuthor] = useState<User>(comment.author)
    const unauthorizedAlert = useUnauthorizedAlert()

    async function handleDeleteComment() {
        await confirmAlert({
            title: 'Delete Comment?',
            message: 'This can’t be undone and it will be removed permanently.',
            confirmButtonLabel: 'Delete',
            onConfirm: () => {
                return deleteComment({ postId: comment.post?.id!, commentId: comment.id }).unwrap()
            },
        })
    }

    async function handleFollow() {
        if (!isLoggedIn) {
            unauthorizedAlert({
                title: `Follow ${author.fullName} to see what they share on ${siteMetadata.appName}.`,
                message: `Sign up so you never miss their Posts.`,
            })
            return
        }

        try {
            const user = await follow(author.id).unwrap()

            setAuthor(user)
            toast.success(`You followed @${author.username}`)
        } catch (err: any) {
            console.error(err)
        }
    }

    async function handleUnfollowClick() {
        try {
            const user = await unfollow(author.id).unwrap()

            setAuthor(user)
            toast.success(`You unfollowed @${author.username}`)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Dropdown placement='bottom'>
            <Tooltip content='Comment options'>
                <PopoverTrigger>
                    <IconButton>
                        <ThreeDotsIcon size='18' />
                    </IconButton>
                </PopoverTrigger>
            </Tooltip>

            <DropdownMenu variant='faded' aria-label='Comment options'>
                {isCurrentUserAuthor ? (
                    <DropdownItem
                        key='delete'
                        onClick={handleDeleteComment}
                        startContent={<DeleteIcon size='18' />}
                        title='Delete'
                    />
                ) : author.isViewerFollow ? (
                    <DropdownItem
                        key='unfollow'
                        onClick={handleUnfollowClick}
                        startContent={<UnfollowIcon size='18' />}
                        title={`Unfollow @${author.username}`}
                    />
                ) : (
                    <DropdownItem
                        key='follow'
                        onClick={handleFollow}
                        startContent={<FollowIcon size='18' />}
                        title={`Follow @${author.username}`}
                    />
                )}
            </DropdownMenu>
        </Dropdown>
    )
}
