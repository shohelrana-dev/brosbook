import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react"
import { BsThreeDots as ThreeDotsIcon } from "react-icons/bs"
import { RiDeleteBin5Line as DeleteIcon, RiUserUnfollowLine as UnfollowIcon } from "react-icons/ri"
import { AiOutlineUserAdd as FollowIcon } from "react-icons/ai"
import { MdHideSource as HideIcon } from "react-icons/md"
import { AiOutlineCopy as CopyIcon } from "react-icons/ai"
import toast from "react-hot-toast"

import OptionButton from "@components/global/OptionButton"
import { useFollowMutation, useUnfollowMutation } from "@services/usersApi"
import { useDeletePostMutation } from "@services/postsApi"
import useAuthState from "@hooks/useAuthState"
import { useConfirmAlert } from "react-use-confirm-alert"
import { Post } from "@interfaces/posts.interfaces"
import { User } from "@interfaces/user.interfaces"
import IconButton from "@components/global/IconButton"
import useUnauthorizedAlert from "@hooks/useUnauthorzedAlert"

interface Props {
    post: Post
}

function PostOptions( { post }: Props ){
    const [follow]     = useFollowMutation()
    const [unfollow]   = useUnfollowMutation()
    const [deletePost] = useDeletePostMutation()

    const { user: currentUser, isAuthenticated } = useAuthState()
    const [author, setAuthor]                    = useState<User>( post.author )
    const [isVisible, setIsOpen]                 = useState( false )
    const confirmAlert                           = useConfirmAlert()
    const unauthorizedAlert                      = useUnauthorizedAlert()

    const isCurrentUserAuthor = isAuthenticated && author && author.id === currentUser?.id

    function toggleModal(){
        setIsOpen( ! isVisible )
    }

    async function handleDeletePostClick(){
        await confirmAlert( {
            title: 'Delete Post?',
            message: 'This can’t be undone and it will be removed from your profile',
            confirmButtonLabel: 'Delete',
            onConfirm: async() => {
                try {
                    await deletePost( post.id ).unwrap()
                    toast.success( 'Post deleted.' )
                } catch ( err: any ) {
                    toast.error( err?.data?.message || 'Post deleting failed.' )
                }
            }
        } )
    }

    async function handleFollowClick(){
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
            toggleModal()
        } catch ( err: any ) {
            console.error( err )
        }
    }

    async function handleUnfollowClick(){
        try {
            const user = await unfollow( author.id ).unwrap()

            setAuthor( user )
            toast.success( `You unfollowed @${ author.username }` )
            toggleModal()
        } catch ( err ) {
            console.error( err )
        }
    }

    function handleHidePost(){
        toggleModal()

        //hide post
    }

    function copyPostLinkToClipboard(){
        navigator.clipboard.writeText( `${ process.env.NEXT_PUBLIC_APP_URL }/posts/${ post.id }` ).then( () => {
            toast.success( 'Post link copied.' )
        } )
    }

    return (
        <Popover placement="bottom-end" open={ isVisible }>
            <PopoverHandler>
                <div>
                    <IconButton onClick={ toggleModal }>
                        <ThreeDotsIcon size="18"/>
                    </IconButton>
                </div>
            </PopoverHandler>
            <PopoverContent className="font-[inherit] p-0 rounded-2xl overflow-hidden" onBlur={ toggleModal }>
                <div className="min-w-[150px]">
                    { isCurrentUserAuthor ? (
                        <OptionButton onClick={ handleDeletePostClick }>
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
                            <OptionButton onClick={ handleFollowClick }>
                                <FollowIcon size="18"/>
                                Follow @{ author.username }
                            </OptionButton>
                        )
                    ) }
                    <OptionButton onClick={ copyPostLinkToClipboard }>
                        <CopyIcon size="18"/>
                        Copy link to post
                    </OptionButton>
                    <OptionButton onClick={ handleHidePost }>
                        <HideIcon size="18"/>
                        Hide
                    </OptionButton>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default PostOptions