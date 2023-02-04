import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react"
import { BsThreeDots as ThreeDotsIcon } from "react-icons/bs"
import { RiDeleteBin5Line as DeleteIcon, RiUserUnfollowLine as UnfollowIcon } from "react-icons/ri"
import { AiOutlineUserAdd as FollowIcon } from "react-icons/ai"
import { MdHideSource as HideIcon } from "react-icons/md"
import { AiOutlineEye as EyeIcon } from "react-icons/ai"
import toast from "react-hot-toast"

import OptionButton from "@components/common/OptionButton"
import { useFollowMutation, useUnfollowMutation } from "@services/usersApi"
import { useDeletePostMutation } from "@services/postsApi"
import useAuthState from "@hooks/useAuthState"
import useConfirmAlert from "@hooks/useConfirmAlert"
import { Post } from "@interfaces/posts.interfaces"
import { User } from "@interfaces/user.interfaces"
import IconButton from "@components/common/IconButton"
import useUnauthorizedAlert from "@hooks/useUnauthorzedAlert"
import Link from "next/link";

interface Props {
    post: Post
    setPost: ( post: Post | null ) => void
}

function PostOptions( { post, setPost }: Props ){
    const [follow]     = useFollowMutation()
    const [unfollow]   = useUnfollowMutation()
    const [deletePost] = useDeletePostMutation()

    const { user: currentUser, isAuthenticated } = useAuthState()
    const [author, setAuthor]                    = useState<User>( post.author )
    const [isOpen, setIsOpen]                    = useState( false )
    const confirmAlert                           = useConfirmAlert()
    const unauthorizedAlert                      = useUnauthorizedAlert()

    const isCurrentUserAuthor = isAuthenticated && author && author.id === currentUser?.id

    function toggleOpen(){
        setIsOpen( ! isOpen )
    }

    async function handleDeletePostClick(){
        const isConfirm = await confirmAlert( {
            title: 'Delete Post?',
            message: 'This can’t be undone and it will be removed from your profile',
            confirmButtonLabel: 'Delete'
        } )
        if( ! isConfirm ) return

        try {
            await deletePost( post.id ).unwrap()
            setPost( null )
            toast.success( 'Post deleted.' )
            toggleOpen()
        } catch ( err: any ) {
            toast.error( err?.data?.message || 'Post deletion was failed.' )
        }
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
                    <IconButton onClick={ toggleOpen }>
                        <ThreeDotsIcon size="18"/>
                    </IconButton>
                </div>
            </PopoverHandler>
            <PopoverContent className="p-0 rounded-2xl overflow-hidden" onBlur={ toggleOpen }>
                <div className="min-w-[150px]">
                    <Link href={ `/posts/${ post.id }` }>
                        <OptionButton>
                            <EyeIcon size="18"/>
                            go to the post page
                        </OptionButton>
                    </Link>
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
                    <OptionButton onClick={ () => {
                        setPost( null )
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

export default PostOptions