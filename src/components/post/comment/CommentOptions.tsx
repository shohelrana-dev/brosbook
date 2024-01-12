import { Popover } from '@mui/material'
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineUserAdd as FollowIcon } from 'react-icons/ai'
import { BsThreeDots as ThreeDotsIcon } from 'react-icons/bs'
import { RiDeleteBin5Line as DeleteIcon, RiUserUnfollowLine as UnfollowIcon } from 'react-icons/ri'

import { IconButton } from '@mui/material'
import { useConfirmAlert } from 'react-use-confirm-alert'
import OptionButton from '~/components/global/OptionButton'
import useAuthState from '~/hooks/useAuthState'
import useUnauthorizedAlert from '~/hooks/useUnauthorzedAlert'
import { Comment } from '~/interfaces/posts.interfaces'
import { User } from '~/interfaces/user.interfaces'
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

	const { isAuthenticated } = useAuthState()
	const confirmAlert = useConfirmAlert()
	const [author, setAuthor] = useState<User>(comment.author)
	const unauthorizedAlert = useUnauthorizedAlert()

	async function handleDeleteComment() {
		await confirmAlert({
			title: 'Delete Comment?',
			message: 'This can’t be undone and it will be removed permanently.',
			confirmButtonLabel: 'Delete',
			onConfirm: async () => {
				try {
					await deleteComment({ postId: comment.post?.id!, commentId: comment.id }).unwrap()
					toast.success('Comment deleted.')
				} catch (err: any) {
					toast.error(err?.data?.message || 'Failed to delete comment.')
				}
			},
		})
	}

	async function handleFollow() {
		if (!isAuthenticated) {
			unauthorizedAlert({
				title: `Follow ${author.fullName} to see what they share on ${process.env.NEXT_PUBLIC_APP_NAME}.`,
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
		<PopupState variant='popover'>
			{popupState => (
				<>
					<div>
						<IconButton {...bindTrigger(popupState)}>
							<ThreeDotsIcon size='18' />
						</IconButton>
					</div>

					<Popover
						{...bindPopover(popupState)}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'center',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
					>
						<div className='min-w-[130px]'>
							{isCurrentUserAuthor ? (
								<OptionButton onClick={handleDeleteComment}>
									<DeleteIcon size='18' className='mr-2' />
									Delete
								</OptionButton>
							) : author.isViewerFollow ? (
								<OptionButton onClick={handleUnfollowClick}>
									<UnfollowIcon size='18' className='mr-2' />
									Unfollow @{author.username}
								</OptionButton>
							) : (
								<OptionButton onClick={handleFollow}>
									<FollowIcon size='18' className='mr-2' />
									Follow @{author.username}
								</OptionButton>
							)}
						</div>
					</Popover>
				</>
			)}
		</PopupState>
	)
}
