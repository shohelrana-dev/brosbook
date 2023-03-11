import React from 'react'
import Reactions from "@components/messages/MessageBox/Reactions"
import { Message } from "@interfaces/conversation.interfaces"
import ImageLightbox from "@components/global/ImageLightbox"
import moment from "moment";

const classes = {
    text: ( isOwn: boolean, hasReaction: boolean ) => (
        `box relative py-2 px-4 my-1 flex items-end gap-1 
        ${ isOwn ? 'bg-theme-blue text-white' : 'bg-white text-gray-700' } 
        ${ hasReaction ? 'mb-3' : 'mb-0' }`
    ),
    emoji: ( hasReaction: boolean ) => `relative pt-2 text-3xl flex items-end gap-1 text-gray-700 ${ hasReaction ? 'mb-3' : 'mb-0' }`,
    image: 'relative max-w-[200px] mb-4 flex items-end gap-1 text-gray-700'
}

interface Props {
    message: Message
}

function MessageContent( { message }: Props ){

    const { type, isMeSender, body, image, reactions, createdAt } = message
    const hasReaction                                             = reactions?.length > 0

    switch ( type ) {
        case 'text':
            return (
                <div className={ classes.text( isMeSender, hasReaction ) }>
                    <Reactions message={ message }/>
                    { body }
                    <p className="text-[10px]">{ moment( createdAt ).format( "h:mm a" ) }</p>
                </div>
            )

        case 'emoji':
            return (
                <div className={ classes.emoji( hasReaction ) }>
                    <Reactions message={ message }/>
                    { body }
                    <p className="text-[10px]">{ moment( createdAt ).format( "h:mm a" ) }</p>
                </div>
            )

        case 'image':
            return (
                <div className={ classes.image }>
                    <Reactions message={ message }/>
                    <ImageLightbox image={ image } alt="message image" width={ 400 } height={ 400 }/>
                    <p className="text-[10px]">{ moment( createdAt ).format( "h:mm a" ) }</p>
                </div>
            )
        
        default:
            return null
    }
}

export default MessageContent