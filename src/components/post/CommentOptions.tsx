import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react"
import { BsThreeDots as ThreeDotsIcon } from "react-icons/bs"
import { RiDeleteBin5Line as DeleteIcon, RiUserUnfollowLine as UnfollowIcon } from "react-icons/ri"
import { AiOutlineUserAdd as FollowIcon } from "react-icons/ai"
import { MdHideSource as HideIcon } from "react-icons/md"
import toast from "react-hot-toast"

import ButtonGray from "@components/common/ButtonGray"
import { useFollowMutation, useUnfollowMutation } from "@services/usersApi"
import { useDeleteCommentMutation } from "@services/commentsApi"
import useCurrentUser from "@hooks/useCurrentUser"
import useConfirm from "@hooks/useConfirm"
import { User } from "@interfaces/user.interfaces"
import { Comment } from "@interfaces/posts.interfaces"
import IconButton from "@components/common/IconButton"

interface Props {
    comment: Comment
    setComment: ( comment: Comment | null ) => void
}

export default function CommentOptions( { comment, setComment }: Props ){
    const [follow]        = useFollowMutation()
    const [unfollow]      = useUnfollowMutation()
    const [deleteComment] = useDeleteCommentMutation()

    const { user: currentUser } = useCurrentUser()
    const confirm               = useConfirm()
    const [author, setAuthor]   = useState<User>( comment.author )

    const isCurrentUserAuthor = author && author.id === currentUser?.id

    async function handleDeleteComment(){
        const isConfirm = await confirm( {
            title: 'Delete Comment?',
            message: 'This can’t be undone and it will be removed permanently.',
            confirmButtonLabel: 'Delete'
        } )
        if( ! isConfirm ) return

        try {
            await deleteComment( { postId: comment.postId, commentId: comment.id } ).unwrap()
            setComment( null )
            toast.success( 'Comment deleted.' )
        } catch ( err: any ) {
            toast.error( err?.data?.message || 'Comment deletion was failed.' )
        }
    }

    async function handleFollow(){
        try {
            const user = await follow( author.id ).unwrap()

            setAuthor( user )
            toast.success( `You followed @${ author.username }` )
        } catch ( err: any ) {
            console.error( err )
        }
    }

    async function handleUnfollowClick(){
        try {
            const user = await unfollow( author.id ).unwrap()

            setAuthor( user )
            toast.success( `You unfollowed @${ author.username }` )
        } catch ( err ) {
            console.error( err )
        }
    }

    return (
        <Popover placement="bottom-end">
            <PopoverHandler>
                <div>
                    <IconButton className="ml-2">
                        <ThreeDotsIcon size="18" />
                    </IconButton>
                </div>
            </PopoverHandler>
            <PopoverContent className="p-0 py-2">
                <div className="w-[250px]">
                    { isCurrentUserAuthor ? (
                        <ButtonGray
                            className="rounded-none w-full flex gap-3 items-center bg-transparent hover:bg-blue-50 mt-0"
                            onClick={ handleDeleteComment }>
                            <DeleteIcon size="18"/>
                            Delete
                        </ButtonGray>
                    ) : (
                        author.isViewerFollow ? (
                            <ButtonGray
                                className="rounded-none w-full flex gap-3 items-center bg-transparent hover:bg-blue-50 mt-0"
                                onClick={ handleUnfollowClick }>
                                <UnfollowIcon size="18"/>
                                Unfollow @{ author.username }
                            </ButtonGray>
                        ) : (
                            <ButtonGray
                                className="rounded-none w-full flex gap-3 items-center bg-transparent hover:bg-blue-50 mt-0"
                                onClick={ handleFollow }>
                                <FollowIcon size="18"/>
                                Follow @{ author.username }
                            </ButtonGray>
                        )
                    ) }
                    <ButtonGray
                        className="rounded-none w-full flex gap-3 items-center bg-transparent hover:bg-blue-50 mt-0"
                        onClick={ () => setComment( null ) }>
                        <HideIcon size="18"/>
                        Hide
                    </ButtonGray>
                </div>
            </PopoverContent>
        </Popover>
    )
}