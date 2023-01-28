import React, { useState } from 'react'
import toast from "react-hot-toast"
import IconButton from "@components/common/IconButton"
import { FaShareSquare as ShareIcon } from "react-icons/fa"
import { Post } from "@interfaces/posts.interfaces"
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react"
import { RiDeleteBin5Line as DeleteIcon } from "react-icons/ri"
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    EmailShareButton,
    EmailIcon
} from "react-share"
import OptionButton from "@components/common/OptionButton"

export default function PostShare( { post }: { post: Post } ){
    const [isOpen, setIsOpen] = useState( false )

    function toggleOpen(){
        setIsOpen( ! isOpen )
    }

    function copyPostLinkToClipboard(){
        navigator.clipboard.writeText( `${ process.env.NEXT_PUBLIC_APP_URL }/posts/${ post.id }` ).then( () => {
            toast.success( 'Post link copied.' )
            toggleOpen()
        } )
    }

    return (
        <Popover placement="bottom-end" open={ isOpen }>
            <PopoverHandler>
                <div className="flex items-center text-gray-600">
                    <IconButton onClick={ toggleOpen }>
                        <ShareIcon size="18"/>
                    </IconButton>
                </div>
            </PopoverHandler>
            <PopoverContent className="p-0 rounded-2xl overflow-hidden" onBlur={ toggleOpen }>
                <div>
                    <OptionButton onClick={ copyPostLinkToClipboard }>
                        <DeleteIcon size="18"/>
                        Copy link to post
                    </OptionButton>
                    <Popover placement="top">
                        <PopoverHandler>
                            <div>
                                <OptionButton>
                                    <ShareIcon size="18"/>
                                    Share to
                                </OptionButton>
                            </div>
                        </PopoverHandler>
                        <PopoverContent className="p-2 flex gap-2">
                            <FacebookShareButton url={ `${ process.env.NEXT_PUBLIC_APP_URL }/posts/${ post.id }` }>
                                <FacebookIcon round={ true } size={ 30 }/>
                            </FacebookShareButton>
                            <TwitterShareButton url={ `${ process.env.NEXT_PUBLIC_APP_URL }/posts/${ post.id }` }>
                                <TwitterIcon round={ true } size={ 30 }/>
                            </TwitterShareButton>
                            <WhatsappShareButton url={ `${ process.env.NEXT_PUBLIC_APP_URL }/posts/${ post.id }` }>
                                <WhatsappIcon round={ true } size={ 30 }/>
                            </WhatsappShareButton>
                            <EmailShareButton url={ `${ process.env.NEXT_PUBLIC_APP_URL }/posts/${ post.id }` }>
                                <EmailIcon round={ true } size={ 30 }/>
                            </EmailShareButton>
                        </PopoverContent>
                    </Popover>
                </div>
            </PopoverContent>
        </Popover>
    )
}