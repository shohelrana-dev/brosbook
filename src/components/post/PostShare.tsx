import React  from 'react'
import IconButton from "@components/global/IconButton"
import { FaShareSquare as ShareIcon } from "react-icons/fa"
import { Post } from "@interfaces/posts.interfaces"
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react"
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
    )
}