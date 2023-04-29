import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react"
import { BsThreeDots as ThreeDotsIcon } from "react-icons/bs"
import { RiDeleteBin5Line as DeleteIcon, RiUserUnfollowLine as UnfollowIcon } from "react-icons/ri"
import { AiOutlineUserAdd as FollowIcon } from "react-icons/ai"
import { MdHideSource as HideIcon } from "react-icons/md"
import toast from "react-hot-toast"

import { useFollowMutation, useUnfollowMutation } from "@services/usersApi"
import { useDeleteCommentMutation } from "@services/commentsApi"
import useAuthState from "@hooks/useAuthState"
import { useConfirmAlert } from "react-use-confirm-alert"
import { User } from "@interfaces/user.interfaces"
import { Comment, Post } from "@interfaces/posts.interfaces"
import IconButton from "@components/global/IconButton"
import OptionButton from "@components/global/OptionButton"
import useUnauthorizedAlert from "@hooks/useUnauthorzedAlert"
import { useModal } from "react-minimal-modal"

interface Props {
    isCurrentUserAuthor: boolean
    comment: Comment
}

export default function CommentOptions( { comment, isCurrentUserAuthor }: Props ){
    const [follow]              = useFollowMutation()
    const [unfollow]            = useUnfollowMutation()
    const [deleteComment]       = useDeleteCommentMutation()
    const { isVisible, toggle } = useModal()

    const { isAuthenticated } = useAuthState()
    const confirmAlert                           = useConfirmAlert()
    const [author, setAuthor]                    = useState<User>( comment.author )
    const unauthorizedAlert                      = useUnauthorizedAlert()

    async function handleDeleteComment(){
        await confirmAlert( {
            title: 'Delete Comment?',
            message: 'This can’t be undone and it will be removed permanently.',
            confirmButtonLabel: 'Delete',
            onConfirm: async() => {
                try {
                    await deleteComment( { postId: comment.post?.id!, commentId: comment.id } ).unwrap()
                    toast.success( 'Comment deleted.' )
                    toggle()
                } catch ( err: any ) {
                    toast.error( err?.data?.message || 'Failed to delete comment.' )
                }
            }
        } )
    }

    async function handleFollow(){
        if( ! isAuthenticated ){
            unauthorizedAlert( {
                title: `Follow ${ author.fullName } to see what they share on ${ process.env.NEXT_PUBLIC_APP_NAME }.`,
                message: `Sign up so you never miss their Posts.`
            } )
            return
        }

        try {
            const user = await follow( author.id ).unwrap()

            setAuthor( user )
            toast.success( `You followed @${ author.username }` )
            toggle()
        } catch ( err: any ) {
            console.error( err )
        }
    }

    async function handleUnfollowClick(){
        try {
            const user = await unfollow( author.id ).unwrap()

            setAuthor( user )
            toast.success( `You unfollowed @${ author.username }` )
            toggle()
        } catch ( err ) {
            console.error( err )
        }
    }

    function handleHideComment() {
        toggle()
    }

    return (
        <Popover placement="bottom-end" open={ isVisible }>
            <PopoverHandler>
                <div>
                    <IconButton className="ml-2" onClick={ toggle }>
                        <ThreeDotsIcon size="18"/>
                    </IconButton>
                </div>
            </PopoverHandler>
            <PopoverContent className="p-0 rounded-2xl overflow-hidden" onBlur={ toggle }>
                <div className="min-w-[130px]">
                    { isCurrentUserAuthor ? (
                        <OptionButton onClick={ handleDeleteComment }>
                            <DeleteIcon size="18"/>
                            Delete
                        </OptionButton>
                    ) : (
                        author.isViewerFollow ? (
                            <OptionButton onClick={ handleUnfollowClick }>
                                <UnfollowIcon size="18"/>
                                Unfollow @{ author.username }
                            </OptionButton>
                        ) : (
                            <OptionButton onClick={ handleFollow }>
                                <FollowIcon size="18"/>
                                Follow @{ author.username }
                            </OptionButton>
                        )
                    ) }
                    <OptionButton onClick={ handleHideComment }>
                        <HideIcon size="18"/>
                        Hide
                    </OptionButton>
                </div>
            </PopoverContent>
        </Popover>
    )
}