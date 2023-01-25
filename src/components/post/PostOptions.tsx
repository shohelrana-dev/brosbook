import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react"
import { BsThreeDots as ThreeDotsIcon } from "react-icons/bs"
import { RiDeleteBin5Line as DeleteIcon, RiUserUnfollowLine as UnfollowIcon } from "react-icons/ri"
import { AiOutlineUserAdd as FollowIcon } from "react-icons/ai"
import { MdHideSource as HideIcon } from "react-icons/md"
import toast from "react-hot-toast"

import OptionButton from "@components/common/OptionButton"
import { useFollowMutation, useUnfollowMutation } from "@services/usersApi"
import { useDeletePostMutation } from "@services/postsApi"
import useCurrentUser from "@hooks/useCurrentUser"
import useConfirm from "@hooks/useConfirm"
import { Post } from "@interfaces/posts.interfaces"
import { User } from "@interfaces/user.interfaces"
import IconButton from "@components/common/IconButton"

interface Props {
    post: Post
    setPost: ( post: Post | null ) => void
}

function PostOptions( { post, setPost }: Props ){
    const [follow]     = useFollowMutation()
    const [unfollow]   = useUnfollowMutation()
    const [deletePost] = useDeletePostMutation()

    const { user: currentUser } = useCurrentUser()
    const confirm               = useConfirm()
    const [author, setAuthor]   = useState<User>( post.author )

    const isCurrentUserAuthor = author && author.id === currentUser?.id

    async function handleDeletePostClick(){
        const isConfirm = await confirm( {
            title: 'Delete Post?',
            message: 'This can’t be undone and it will be removed from your profile',
            confirmButtonLabel: 'Delete'
        } )
        if( ! isConfirm ) return

        try {
            await deletePost( post.id ).unwrap()
            setPost( null )
            toast.success( 'Post deleted.' )
        } catch ( err: any ) {
            toast.error( err?.data?.message || 'Post deletion was failed.' )
        }
    }

    async function handleFollowClick(){
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
                    <IconButton>
                        <ThreeDotsIcon size="18"/>
                    </IconButton>
                </div>
            </PopoverHandler>
            <PopoverContent className="p-0 rounded-2xl overflow-hidden">
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
                    <OptionButton onClick={ () => setPost( null ) }>
                        <HideIcon size="18"/>
                        Hide
                    </OptionButton>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default PostOptions