"use client"
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react"
import IconButton from "@components/common/IconButton"
import { BsThreeDots as ThreeDotsIcon } from "react-icons/bs"
import React from "react"
import toast from "react-hot-toast"
import { RiLink as LinkIcon } from "react-icons/ri"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { User } from "@interfaces/user.interfaces"
import ButtonGray from "@components/common/ButtonGray"

export default function ExtraOptions( { user }: { user: User } ){
    return (
        <Popover placement="bottom">
            <PopoverHandler>
                <div>
                    <IconButton className="ml-2 border-2 border-gray-200 flex-wrap">
                        <ThreeDotsIcon size="18"/>
                    </IconButton>
                </div>
            </PopoverHandler>
            <PopoverContent className="p-0 py-2">
                <div className="w-[250px]">
                    <CopyToClipboard
                        text={ `${ process.env.NEXT_PUBLIC_APP_URL }/${ user.username }` }
                        onCopy={ () => toast.success( 'Link copied.' ) }>
                        <ButtonGray
                            className="rounded-none w-full flex gap-3 items-center bg-transparent hover:bg-blue-50 mt-0">
                            <LinkIcon size="18"/>
                            Copy link to profile
                        </ButtonGray>
                    </CopyToClipboard>
                </div>
            </PopoverContent>
        </Popover>
    )
}