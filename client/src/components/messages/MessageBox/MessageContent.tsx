import React          from 'react'
import { SRLWrapper} from "simple-react-lightbox"

import Reactions   from "@components/messages/MessageBox/Reactions"
import { Message } from "@interfaces/chat.interfaces"


//the component classes
const classes = {
    text: ( isOwn: boolean, hasReaction: boolean ) => (
        `box relative py-2 px-4 my-1 
        ${ isOwn ? 'bg-theme-blue text-white' : 'bg-white text-gray-700' } 
        ${ hasReaction ? 'mb-3' : 'mb-0' }`
    ),
    emoji: ( hasReaction: boolean ) => `relative pt-2 text-3xl ${ hasReaction ? 'mb-3' : 'mb-0' }`,
    image: 'relative max-w-[200px] mb-4'
}

interface MessageContentProps {
    isOwnMessage: boolean
    message: Message
}

function MessageContent( { isOwnMessage, message }: MessageContentProps ) {

    const hasReaction = message.reactions.length > 0

    const reactionMarkup = (
        <Reactions reactions={ message.reactions } isOwnMessage={ isOwnMessage } messageId={ message.id }/>
    )

    switch ( message.type ) {
        case 'text':
            return (
                <div className={ classes.text( isOwnMessage, hasReaction ) }>
                    { reactionMarkup }
                    { message.body }
                </div>
            )

        case 'emoji':
            return (
                <div className={ classes.emoji( hasReaction ) }>
                    { reactionMarkup }
                    { message.body }
                </div>
            )

        case 'image':
            return (
                <div className={ classes.image }>
                    { reactionMarkup }
                    <SRLWrapper>
                        <a href={ message.imageUrl }>
                            <img src={ message.imageUrl } alt="thumb"/>
                        </a>
                    </SRLWrapper>
                </div>
            )

        default:
            return null
    }
}

export default MessageContent