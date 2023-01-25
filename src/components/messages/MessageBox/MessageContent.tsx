import React from 'react'
import Reactions from "@components/messages/MessageBox/Reactions"
import { Message } from "@interfaces/conversation.interfaces"
import ImageLightbox from "@components/common/ImageLightbox"
import useAuthState from "@hooks/useAuthState"

const classes = {
    text: ( isOwn: boolean, hasReaction: boolean ) => (
        `box relative py-2 px-4 my-1 
        ${ isOwn ? 'bg-theme-blue text-white' : 'bg-white text-gray-700' } 
        ${ hasReaction ? 'mb-3' : 'mb-0' }`
    ),
    emoji: ( hasReaction: boolean ) => `relative pt-2 text-3xl ${ hasReaction ? 'mb-3' : 'mb-0' }`,
    image: 'relative max-w-[200px] mb-4'
}

interface Props {
    message: Message
}

function MessageContent( { message }: Props ){
    const hasReaction = message.reactions?.length > 0

    switch ( message.type ) {
        case 'text':
            return (
                <div className={ classes.text( message.isMeSender, hasReaction ) }>
                    <Reactions message={ message }/>
                    { message.body }
                </div>
            )

        case 'emoji':
            return (
                <div className={ classes.emoji( hasReaction ) }>
                    <Reactions message={ message }/>
                    { message.body }
                </div>
            )

        case 'image':
            return (
                <div className={ classes.image }>
                    <Reactions message={ message }/>
                    <ImageLightbox src={ message.image?.url! } alt="message image" width={ 400 } height={ 400 }/>
                </div>
            )

        default:
            return null
    }
}

export default MessageContent