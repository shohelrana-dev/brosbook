import React, { FormEvent, useState } from 'react'
import { Conversation, MessageType } from "@interfaces/conversation.interfaces"
import useSelectFile from "@hooks/useSelectFile"
import { AiFillCamera as CameraIcon, AiOutlineDelete as DeleteIcon } from "react-icons/ai"
import { BsHeartFill as LikeIcon } from "react-icons/bs"
import { MdSend as SendIcon } from "react-icons/md"
import BasicInput from "@components/common/BasicInput"
import IconButton from "@components/common/IconButton"
import { useSendMessageMutation } from "@services/conversationApi"
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react"
import { HiOutlineEmojiHappy as EmojiIcon } from "react-icons/hi"
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react"
//@ts-ignore
import { isOneEmoji, isMultipleEmoji } from 'is-emojis'

interface Props {
    conversation: Conversation
}

export default function CreateMessageForm( { conversation }: Props ){
    //hooks
    const [sendMessage]                                                     = useSendMessageMutation()
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
            <form onSubmit={ submitForm } className="box flex items-center py-3 px-3 w-full">
                <div className="flex items-center mb-2">
                    <input ref={ inputRef } onChange={ onChange } type="file" name="file" accept="image/*" hidden/>
                    <CameraIcon onClick={ onClick } className="mr-2 cursor-pointer text-gray-500" fontSize={ 22 }/>
                    { selectedFile && (
                        <div className="max-w-[200px] flex justify-center mx-3">
                            <img src={ URL.createObjectURL( selectedFile ) } alt="Thumb"/>
                            <button onClick={ removeSelectedFile }
                                    className="cursor-pointer text-gray-500">
                                <DeleteIcon/>
                            </button>
                        </div>
                    ) }
                </div>
                <div className="w-full">
                    <BasicInput label="Message" labelHide onChange={ ( e ) => setMessageText( e.target.value ) }
                                value={ messageText }/>
                </div>
                <IconButton onClick={ clickLoveHandle }>
                    <LikeIcon fontSize="medium" color="#FF1493"/>
                </IconButton>
                <Popover>
                    <PopoverHandler>
                        <div>
                            <IconButton type="button">
                                <EmojiIcon className="text-gray-400" fontSize={ 20 }/>
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
                <button type="submit" className="rounded-full bg-theme-blue text-white p-2 ml-1">
                    <SendIcon fontSize={ 20 }/>
                </button>
            </form>
        </div>
    )
}