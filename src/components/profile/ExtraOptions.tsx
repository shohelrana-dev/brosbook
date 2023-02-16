"use client"
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react"
import IconButton from "@components/global/IconButton"
import { BsThreeDots as ThreeDotsIcon } from "react-icons/bs"
import React, { useState } from "react"
import toast from "react-hot-toast"
import { RiLink as LinkIcon } from "react-icons/ri"
import { User } from "@interfaces/user.interfaces"
import OptionButton from "@components/global/OptionButton"

export default function ExtraOptions( { user }: { user: User } ){
    const [isOpen, setIsOpen] = useState( false )

    function toggleOpen(){
        setIsOpen( ! isOpen )
    }

    function copyProfileLinkToClipboard(){
        navigator.clipboard.writeText( `${ process.env.NEXT_PUBLIC_APP_URL }/${ user.username }` ).then( () => {
            toast.success( 'Profile link copied.' )
            toggleOpen()
        } )
    }

    return (
        <Popover placement="bottom" open={ isOpen }>
            <PopoverHandler>
                <div>
                    <IconButton className="ml-2 border-2 border-gray-200 block z-10" onClick={ toggleOpen }>
                        <ThreeDotsIcon size="18"/>
                    </IconButton>
                </div>
            </PopoverHandler>
            <PopoverContent className="p-0 rounded-2xl block relative block" onBlur={ toggleOpen }>
                <div>
                    <OptionButton className="z-50" onClick={ copyProfileLinkToClipboard }>
                        <LinkIcon size="18"/>
                        Copy link to profile
                    </OptionButton>
                </div>
            </PopoverContent>
        </Popover>
    )
}