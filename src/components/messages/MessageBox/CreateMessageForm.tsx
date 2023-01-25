import React, { FormEvent, useState } from 'react'
import { Conversation, MessageType } from "@interfaces/conversation.interfaces"
import useSelectFile from "@hooks/useSelectFile"
import { RiGalleryLine as GalleryIcon } from "react-icons/ri"
import { BsHeartFill as LikeIcon } from "react-icons/bs"
import { MdSend as SendIcon } from "react-icons/md"
import IconButton from "@components/common/IconButton"
import { useSendMessageMutation } from "@services/conversationApi"
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react"
import { HiOutlineEmojiHappy as EmojiIcon } from "react-icons/hi"
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react"
//@ts-ignore
import { isOneEmoji, isMultipleEmoji } from 'is-emojis'
import { RxCross2 as CancelIcon } from "react-icons/rx"

interface Props {
    conversation: Conversation
}

export default function CreateMessageForm( { conversation }: Props ){
    //hooks
    const [sendMessage, { isLoading }]                                      = useSendMessageMutation()
    const { inputRef, onClick, onChange, removeSelectedFile, selectedFile } = useSelectFile()
    const [messageText, setMessageText]                                     = useState<string>( '' )

    async function submitForm( event: FormEvent<HTMLFormElement> ){
        event.preventDefault()

        if( messageText ){
            try {
                const formData = new FormData()
                formData.append( 'conversationId', conversation?.id! )
                formData.append( 'body', messageText )
                formData.append( 'type', isMultipleEmoji( messageText ) ? MessageType.EMOJI : MessageType.TEXT )

                await sendMessage( formData ).unwrap()

                setMessageText( '' )
            } catch ( err ) {
                console.log( err )
            }
        }

        if( selectedFile ){
            try {
                const formData = new FormData()
                formData.append( 'conversationId', conversation?.id! )
                formData.append( 'image', selectedFile )
                formData.append( 'type', MessageType.IMAGE )

                await sendMessage( formData ).unwrap()

                removeSelectedFile()
            } catch ( err ) {
                console.log( err )
            }
        }
    }

    async function clickLoveHandle(){
        const love = '❤️'

        try {
            const formData = new FormData()
            formData.append( 'conversationId', conversation?.id! )
            formData.append( 'body', love )
            formData.append( 'type', MessageType.EMOJI )

            await sendMessage( formData ).unwrap()
        } catch ( err ) {
            console.log( err )
        }
    }

    async function onEmojiClick( emojiData: EmojiClickData ){
        setMessageText( `${ messageText }${ emojiData.emoji }` )
    }

    if( ! conversation ) return null

    return (
        <div className="relative mb-1 lg:mb-6">
            <form onSubmit={ submitForm }
                  className="flex items-center w-full rounded-2xl broder-2 border-gray-100 bg-white px-2 py-2">
                { ! selectedFile ? (
                    <>
                        <IconButton className="px-2 text-theme-blue">
                            <input ref={ inputRef } onChange={ onChange } type="file" name="file" accept="image/*"
                                   hidden/>
                            <GalleryIcon onClick={ onClick } fontSize={ 17 }/>
                        </IconButton>
                        <Popover>
                            <PopoverHandler>
                                <div className="mr-1 text-theme-blue">
                                    <IconButton type="button">
                                        <EmojiIcon fontSize={ 20 }/>
                                    </IconButton>
                                </div>
                            </PopoverHandler>
                            <PopoverContent className="p-0 rounded-full z-20">
                                <EmojiPicker
                                    onEmojiClick={ onEmojiClick }
                                    autoFocusSearch={ false }
                                    skinTonesDisabled
                                    emojiStyle={ EmojiStyle.FACEBOOK }
                                />
                            </PopoverContent>
                        </Popover>
                    </>
                ) : null }
                <div className="w-full relative">
                    { selectedFile && (
                        <div className="max-w-[200px] flex justify-center mx-3 mb-1 relative">
                            <img src={ URL.createObjectURL( selectedFile ) } alt="Thumb"/>
                            <IconButton onClick={ removeSelectedFile }
                                        className="absolute right-1 top-1 bg-black text-white hover:bg-gray-900 hover:text-white z-50">
                                <CancelIcon size={ 15 }/>
                            </IconButton>
                        </div>
                    ) }
                    <input
                        disabled={ !! selectedFile }
                        className="w-full bg-transparent hover:border-none focus:border-none focus:outline-none p-3"
                        placeholder="Start a new message"
                        onChange={ ( e ) => setMessageText( e.target.value ) }
                        value={ messageText }
                    />
                </div>
                <IconButton onClick={ clickLoveHandle } className="px-3">
                    <LikeIcon fontSize="medium" color="#FF1493" className="mt-[2px]"/>
                </IconButton>

                <IconButton type="submit" className="text-theme-blue bg-transparent px-4 disabled:text-blue-400"
                            disabled={ isLoading || ! messageText }>
                    <SendIcon fontSize={ 20 } className="ml-1"/>
                </IconButton>
            </form>
        </div>
    )
}