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
import useConfirmAlert from "@hooks/useConfirmAlert"
import { User } from "@interfaces/user.interfaces"
import { Comment, Post } from "@interfaces/posts.interfaces"
import IconButton from "@components/common/IconButton"
import OptionButton from "@components/common/OptionButton"
import useUnauthorizedPopup from "@hooks/useUnauthorzedPopup"

interface Props {
    post: Post
    comment: Comment
    setComment: ( comment: Comment | null ) => void
}

export default function CommentOptions( { post, comment, setComment }: Props ){
    const [follow]            = useFollowMutation()
    const [unfollow]          = useUnfollowMutation()
    const [deleteComment]     = useDeleteCommentMutation()
    const [isOpen, setIsOpen] = useState( false )

    const { user: currentUser, isAuthenticated } = useAuthState()
    const confirmAlert                                = useConfirmAlert()
    const [author, setAuthor]                    = useState<User>( comment.author )
    const unauthorizedPopup                      = useUnauthorizedPopup()

    const isCurrentUserAuthor = isAuthenticated && comment.author && ( comment.author.id === currentUser?.id || post.author.id === currentUser?.id )

    function toggleOpen(){
        setIsOpen( ! isOpen )
    }

    async function handleDeleteComment(){
        const isConfirm = await confirmAlert( {
            title: 'Delete Comment?',
            message: 'This can’t be undone and it will be removed permanently.',
            confirmButtonLabel: 'Delete'
        } )
        if( ! isConfirm ) return

        try {
            await deleteComment( { postId: comment.postId, commentId: comment.id } ).unwrap()
            setComment( null )
            toast.success( 'Comment deleted.' )
            toggleOpen()
        } catch ( err: any ) {
            toast.error( err?.data?.message || 'Comment deletion was failed.' )
        }
    }

    async function handleFollow(){
        if( ! isAuthenticated ){
            unauthorizedPopup( {
                title: `Follow ${ author.fullName } to see what they share on ${ process.env.NEXT_PUBLIC_APP_NAME }.`,
                message: `Sign up so you never miss their Posts.`
            } )
            return
        }

        try {
            const user = await follow( author.id ).unwrap()

            setAuthor( user )
            toast.success( `You followed @${ author.username }` )
            toggleOpen()
        } catch ( err: any ) {
            console.error( err )
        }
    }

    async function handleUnfollowClick(){
        try {
            const user = await unfollow( author.id ).unwrap()

            setAuthor( user )
            toast.success( `You unfollowed @${ author.username }` )
            toggleOpen()
        } catch ( err ) {
            console.error( err )
        }
    }

    return (
        <Popover placement="bottom-end" open={ isOpen }>
            <PopoverHandler>
                <div>
                    <IconButton className="ml-2" onClick={ toggleOpen }>
                        <ThreeDotsIcon size="18"/>
                    </IconButton>
                </div>
            </PopoverHandler>
            <PopoverContent className="p-0 rounded-2xl overflow-hidden" onBlur={ toggleOpen }>
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
                    <OptionButton onClick={ () => {
                        setComment( null )
                        toggleOpen()
                    } }>
                        <HideIcon size="18"/>
                        Hide
                    </OptionButton>
                </div>
            </PopoverContent>
        </Popover>
    )
}