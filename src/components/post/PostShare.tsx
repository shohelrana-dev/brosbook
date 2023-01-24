import React from 'react'
import { CopyToClipboard } from "react-copy-to-clipboard"
import toast from "react-hot-toast"
import IconButton from "@components/common/IconButton"
import { FaShareSquare as ShareIcon } from "react-icons/fa"
import { Post } from "@interfaces/posts.interfaces"
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react"
import ButtonGray from "@components/common/ButtonGray"
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

export default function PostShare( { post }: { post: Post } ){
    return (
        <Popover placement="bottom-end">
            <PopoverHandler>
                <div className="flex items-center text-gray-600">
                    <IconButton>
                        <ShareIcon size="18"/>
                    </IconButton>
                </div>
            </PopoverHandler>
            <PopoverContent className="p-0 rounded-2xl overflow-hidden">
                <div className="w-[250px]">
                    <CopyToClipboard
                        text={ `${ process.env.NEXT_PUBLIC_APP_URL }/posts/${ post.id }` }
                        onCopy={ () => toast.success( 'Link copied.' ) }>
                        <ButtonGray
                            className="rounded-none w-full flex gap-3 items-center bg-transparent mt-0">
                            <DeleteIcon size="18"/>
                            Copy link to post
                        </ButtonGray>
                    </CopyToClipboard>
                    <Popover placement="top">
                        <PopoverHandler>
                            <div>
                                <ButtonGray
                                    className="rounded-none w-full flex gap-3 items-center bg-transparent mt-0">
                                    <ShareIcon size="18"/>
                                    Share to
                                </ButtonGray>
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