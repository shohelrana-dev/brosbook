import React, { useState } from 'react'
import { BsThreeDots as ThreeDotsIcon } from 'react-icons/bs'
import { RiDeleteBin5Line as DeleteIcon, RiUserUnfollowLine as UnfollowIcon } from 'react-icons/ri'
import { AiOutlineUserAdd as FollowIcon } from 'react-icons/ai'
import { MdHideSource as HideIcon } from 'react-icons/md'
import { AiOutlineCopy as CopyIcon } from 'react-icons/ai'
import toast from 'react-hot-toast'
import { Popover, Tooltip } from '@mui/material'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'

import OptionButton from '@components/global/OptionButton'
import { useFollowMutation, useUnfollowMutation } from '@services/usersApi'
import { postsApi, useDeletePostMutation } from '@services/postsApi'
import useAuthState from '@hooks/useAuthState'
import { useConfirmAlert } from 'react-use-confirm-alert'
import { Post } from '@interfaces/posts.interfaces'
import { User } from '@interfaces/user.interfaces'
import { IconButton } from '@mui/material'
import useUnauthorizedAlert from '@hooks/useUnauthorzedAlert'
import { useDispatch } from 'react-redux'
import { ListResponse } from '@interfaces/index.interfaces'
import { usePathname } from 'next/navigation'

interface Props {
    post: Post
}

export default function PostOptions({ post }: Props) {
    const [follow] = useFollowMutation()
    const [unfollow] = useUnfollowMutation()
    const [deletePost] = useDeletePostMutation()

    const { user: currentUser, isAuthenticated } = useAuthState()
    const [author, setAuthor] = useState<User>(post.author)
    const confirmAlert = useConfirmAlert()
    const unauthorizedAlert = useUnauthorizedAlert()
    const dispatch = useDispatch()
    const pathname = usePathname()

    const isCurrentUserAuthor = isAuthenticated && author && author.id === currentUser?.id

    async function handleDeletePostClick() {
        await confirmAlert({
            title: 'Delete Post?',
            message: 'This can’t be undone and it will be removed from your profile',
            confirmButtonLabel: 'Delete',
            onConfirm: async () => {
                try {
                    await deletePost(post.id).unwrap()
                    toast.success('Post deleted.')
                } catch (err: any) {
                    toast.error(err?.data?.message || 'Post deleting failed.')
                }
            },
        })
    }

    async function handleFollowClick() {
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

    function handleHidePost() {
        const removePostFromDraft = (draft: ListResponse<Post>) => {
            if (draft?.items && draft.items.length > 0) {
                draft.items = draft.items.filter(p => p.id !== post.id)
            }
        }
        //@ts-ignore
        dispatch(postsApi.util.updateQueryData('getPosts', { authorId: post.author.id } as any, removePostFromDraft))
        //@ts-ignore
        dispatch(postsApi.util.updateQueryData('getFeedPosts', undefined as any, removePostFromDraft))
    }

    function copyPostLinkToClipboard() {
        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL}/posts/${post.id}`).then(() => {
            toast.success('Post link copied.')
        })
    }

    return (
        <PopupState variant='popover'>
            {popupState => (
                <div>
                    <Tooltip title='Options'>
                        <IconButton {...bindTrigger(popupState)}>
                            <ThreeDotsIcon size='18' />
                        </IconButton>
                    </Tooltip>

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
                        <div className='min-w-[150px] max-w-[200px]'>
                            {isCurrentUserAuthor ? (
                                <OptionButton onClick={handleDeletePostClick}>
                                    <DeleteIcon
                                        size='18'
                                        className='mr-2'
                                    />
                                    Delete
                                </OptionButton>
                            ) : author.isViewerFollow ? (
                                <OptionButton onClick={handleUnfollowClick}>
                                    <UnfollowIcon
                                        size='18'
                                        className='mr-2'
                                    />
                                    Unfollow @{author.username}
                                </OptionButton>
                            ) : (
                                <OptionButton onClick={handleFollowClick}>
                                    <FollowIcon
                                        size='18'
                                        className='mr-2'
                                    />
                                    Follow @{author.username}
                                </OptionButton>
                            )}
                            <OptionButton onClick={copyPostLinkToClipboard}>
                                <CopyIcon
                                    size='18'
                                    className='mr-2'
                                />
                                Copy link to post
                            </OptionButton>
                            {!pathname?.startsWith('/posts/') && (
                                <OptionButton onClick={handleHidePost}>
                                    <HideIcon
                                        size='18'
                                        className='mr-2'
                                    />
                                    Hide
                                </OptionButton>
                            )}
                        </div>
                    </Popover>
                </div>
            )}
        </PopupState>
    )
}
