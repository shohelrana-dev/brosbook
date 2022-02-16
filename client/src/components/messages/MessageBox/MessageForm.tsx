import React, { ChangeEvent, createRef, FormEvent, useState } from 'react'
import PhotoCameraBackIcon                                    from "@mui/icons-material/PhotoCameraBack"
import DeleteOutlineIcon                                      from "@mui/icons-material/DeleteOutline"
import FavoriteBorderIcon                                     from "@mui/icons-material/FavoriteBorder"
import SendIcon                                               from "@mui/icons-material/Send"
import emojiRegex                                             from "emoji-regex"
import imageCompression                                       from "browser-image-compression"
import { useSelector }                                        from "react-redux"

import { socket }    from "@components/common/AuthCheck"
import { RootState } from "@store/index"

function MessageForm() {
    //hooks
    const { user }                            = useSelector( ( state: RootState ) => state.auth )
    const { currentConversation }             = useSelector( ( state: RootState ) => state.chat )
    const fileInputRef                        = createRef<HTMLInputElement>()
    const [ selectedImage, setSelectedImage ] = useState<any>( null )

    async function submitFormHandle( event: FormEvent<HTMLFormElement> ) {
        event.preventDefault()

        const messageText = event.currentTarget.message.value.trim()
        if ( messageText.length < 1 && !selectedImage ) return

        if ( messageText.length > 0 ) {
            const messageData = {
                body: messageText,
                type: messageText.match( emojiRegex() ) ? 'emoji' : 'text',
                senderId: user.id,
                participantId: currentConversation.participant.id,
                conversationIdentifier: currentConversation.identifier
            }

            //send_message event fire
            socket.emit( 'send_message', messageData )
        }

        if ( selectedImage ) {
            // you should provide one of maxSizeMB, maxWidthOrHeight in the options
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            }

            const compressedImage = await imageCompression( selectedImage, options )

            const reader = new FileReader()
            reader.readAsArrayBuffer( compressedImage )
            reader.onload = ( evt: any ) => {
                const messageData = {
                    type: 'image',
                    senderId: user.id,
                    participant: currentConversation.participant.id,
                    base64Image: evt.target.result,
                    imageName: selectedImage.name,
                    conversationIdentifier: currentConversation.identifier
                }
                //send_message event fire
                socket.emit( "send_message", messageData )
            }
        }

        event.currentTarget?.reset()
        if ( selectedImage ) setSelectedImage( null )
    }

    function clickLoveHandle() {
        const messageData = {
            body: '❤️',
            type: 'emoji',
            senderId: user.id,
            participantId: currentConversation.participant.id,
            conversationIdentifier: currentConversation.identifier
        }

        //send_message event fire
        socket.emit( 'send_message', messageData )
    }

    function fileInputChangeHandle( event: ChangeEvent<HTMLInputElement> ) {
        if ( event.target.files && event.target.files.length > 0 ) {
            setSelectedImage( event.target.files[0] )
        }
    }

    return (
        <div className="relative mb-1 lg:mb-6">
            <form onSubmit={ submitFormHandle } className="box flex items-center py-3 px-3">
                <div className="flex items-center">
                    <input ref={ fileInputRef } onChange={ fileInputChangeHandle } type="file" name="file"
                           accept="image/*"
                           className="hidden"/>
                    <PhotoCameraBackIcon onClick={ () => fileInputRef.current?.click() }
                                         className="mr-2 cursor-pointer text-gray-500"/>
                    { selectedImage && (
                        <div className="max-w-[200px] flex justify-center mx-3">
                            <img
                                src={ URL.createObjectURL( selectedImage ) }
                                alt="Thumb"
                            />
                            <button onClick={ () => setSelectedImage( null ) }
                                    className="cursor-pointer text-gray-500">
                                <DeleteOutlineIcon/>
                            </button>
                        </div>
                    ) }
                </div>
                <input name="message" className="input-basic py-3" placeholder="Type your message..."/>
                <button type="button" onClick={ clickLoveHandle }>
                    <FavoriteBorderIcon className="text-gray-500"/>
                </button>
                <button type="submit" className="rounded-full bg-theme-blue text-white p-2 ml-1">
                    <SendIcon/>
                </button>
            </form>
        </div>
    )
}

export default MessageForm