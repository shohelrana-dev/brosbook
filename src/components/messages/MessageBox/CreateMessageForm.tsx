import React, { FormEvent, useState, useRef } from 'react'
import { MessageType } from "@interfaces/conversation.interfaces"
import useSelectFile from "@hooks/useSelectFile"
import { RiGalleryLine as GalleryIcon } from "react-icons/ri"
import { BsHeartFill as LikeIcon } from "react-icons/bs"
import { MdSend as SendIcon } from "react-icons/md"
import { IconButton } from '@mui/material'
import { useSendMessageMutation } from "@services/messagesApi"
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react"
import { HiOutlineEmojiHappy as EmojiIcon } from "react-icons/hi"
import { Popover } from "@mui/material"
//@ts-ignore
import { isOneEmoji, isMultipleEmoji } from 'is-emojis'
import { RxCross2 as CancelIcon } from "react-icons/rx"
import { useParams } from "next/navigation"
import classNames from "classnames"
import { useGetConversationByIdQuery } from "@services/conversationsApi"
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state"

export default function CreateMessageForm() {
    //hooks
    const { conversationId }                                                = useParams()
    const { data: conversation }                                            = useGetConversationByIdQuery(conversationId as string)
    const [ sendMessage, { isLoading } ]                                    = useSendMessageMutation()
    const { inputRef, onClick, onChange, removeSelectedFile, selectedFile } = useSelectFile()
    const textInputRef                                                      = useRef<HTMLInputElement | null>(null)
    const [ isFocused, setIsFocused ]                                       = useState(false)
    const [ messageText, setMessageText ]                                   = useState('')

    async function submitForm( event: FormEvent<HTMLFormElement> ) {
        event.preventDefault()
        if ( !messageText && !selectedFile ) return

        setMessageText('')
        removeSelectedFile()

        const conversationId = conversation?.id!
        const body           = messageText
        const type           = isMultipleEmoji(messageText) ? MessageType.EMOJI : ( selectedFile ? MessageType.IMAGE : MessageType.TEXT )
        const image          = selectedFile

        sendMessage({
            conversationId,
            data: { type, body, image }
        })
    }

    async function clickLoveHandle() {
        const love = '❤️'

        await sendMessage({
            conversationId: conversation?.id!,
            data: {
                type: MessageType.EMOJI,
                body: love
            }
        })
    }

    async function onEmojiClick( emojiData: EmojiClickData ) {
        setMessageText(`${ messageText }${ emojiData.emoji }`)
    }

    if ( !conversation ) return null

    return (
        <form
            onSubmit={ submitForm }
            className={ classNames("flex items-center mb-2 rounded-2xl bg-white px-2 border-2 border-solid border-gray-200", {
                "border-theme-light-green": isFocused
            }) }
            onClick={ () => textInputRef.current?.focus() }
            onBlur={ () => textInputRef.current?.blur() }
        >
            { !selectedFile ? (
                <>
                    <IconButton className="p-2 text-theme-green">
                        <input ref={ inputRef } onChange={ onChange } type="file" name="file" accept="image/*"
                                hidden/>
                        <GalleryIcon onClick={ onClick } fontSize={ 17 }/>
                    </IconButton>

                    <PopupState variant="popover">
                        { ( popupState ) => (
                            <div>
                                <div className="mr-1">
                                    <IconButton type="button" { ...bindTrigger(popupState) }>
                                        <EmojiIcon fontSize={ 20 } className="text-theme-green"/>
                                    </IconButton>
                                </div>
                                <Popover
                                    { ...bindPopover(popupState) }
                                    anchorOrigin={ {
                                        vertical: 'top',
                                        horizontal: 'center',
                                    } }
                                    transformOrigin={ {
                                        vertical: 'top',
                                        horizontal: 'center',
                                    } }
                                >
                                    <EmojiPicker
                                        onEmojiClick={ onEmojiClick }
                                        autoFocusSearch={ false }
                                        skinTonesDisabled
                                        emojiStyle={ EmojiStyle.FACEBOOK }
                                    />
                                </Popover>
                            </div>
                        ) }
                    </PopupState>
                </>
            ) : null }
            <div className="w-full relative">
                { selectedFile && (
                    <div className="max-w-[190px] flex justify-center mx-3 mb-1 relative rounded-2xl">
                        <img src={ URL.createObjectURL(selectedFile) } alt="Thumb" className="rounded-2xl"/>
                        <div onClick={ removeSelectedFile } className="absolute right-1 top-1">
                            <IconButton
                                sx={ {
                                    zIndex: 20,
                                    background: "#000",
                                    color: '#fff',
                                    '&:hover': { background: 'rgba(0, 0, 0, 0.7)' }
                                } }
                            >
                                <CancelIcon size={ 15 }/>
                            </IconButton>
                        </div>
                    </div>
                ) }
                <input
                    ref={ textInputRef }
                    disabled={ !!selectedFile }
                    className="w-full bg-transparent hover:border-none focus:border-none focus:outline-none py-3"
                    placeholder="Start a new message"
                    onChange={ ( e ) => setMessageText(e.target.value) }
                    value={ messageText }
                    onFocus={ () => setIsFocused(true) }
                    onBlur={ () => setIsFocused(false) }
                />
            </div>
            <IconButton onClick={ clickLoveHandle } disabled={ isLoading }>
                <LikeIcon fontSize="medium" color="#FF1493" className="mt-[2px]"/>
            </IconButton>

            <IconButton
                type="submit"
                disabled={ isLoading || ( !messageText && !selectedFile ) }
                sx={ {
                    color: ( theme ) => theme.palette.themeLightGreen,
                    '&:disabled': '#ddd'
                } }
            >
                <SendIcon fontSize={ 20 } className="ml-1"/>
            </IconButton>
        </form>
    )
}