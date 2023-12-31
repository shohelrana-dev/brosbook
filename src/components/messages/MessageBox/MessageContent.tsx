import Reactions from "@components/messages/MessageBox/Reactions"
import { Message } from "@interfaces/conversation.interfaces"
import ImageLightbox from "@components/global/ImageLightbox"
import moment from "moment"
import Linkify from 'linkify-react'
import { twJoin } from 'tailwind-merge'

const classes = {
    textMessage: ({ isOwn, hasReaction }: { isOwn: boolean, hasReaction: boolean }) => (
        twJoin(
            'box relative py-2 px-4 my-1 flex items-end gap-1', 
            isOwn ? `bg-theme-green text-white [a]:text-blue-100` : `bg-white text-gray-700 [a]:text-blue-500`,
            hasReaction ? `mb-3` : `mb-0`
        )
    ),
    emojiMessage: ({ hasReaction }: { hasReaction: boolean }) => (
        twJoin('relative pt-2 text-3xl flex items-end gap-1 text-gray-700', hasReaction ? `mb-3` : `mb-0`)
    ),
    imageMessage: 'relative max-w-[200px] flex items-end gap-1 text-gray-700',
    time: 'text-[10px]'
}

interface Props {
    message: Message
}

export default function MessageContent( { message }: Props ) {
    const { type, isMeSender, body, image, reactions, createdAt } = message
    const hasReaction                                             = reactions?.length > 0

    const timeMarkup = (
        <time className={classes.time}>
            { moment(createdAt).format("h:mm a") }
        </time>
    )

    switch ( type ) {
        case 'text':
            return (
                <div className={classes.textMessage({hasReaction, isOwn: isMeSender})}>
                    <Reactions message={ message }/>
                    <span className="break-all">
                        <Linkify >{ body }</Linkify>
                    </span>
                    { timeMarkup }
                </div>
            )

        case 'emoji':
            return (
                <div className={classes.emojiMessage({hasReaction})}>
                    <Reactions message={ message }/>
                    { body }
                    { timeMarkup }
                </div>
            )

        case 'image':
            return (
                <div className={classes.imageMessage}>
                    <Reactions message={ message }/>
                    <ImageLightbox
                        image={ image }
                        width="300"
                        height="200"
                        alt="message image"
                    />
                    { timeMarkup }
                </div>
            )

        default:
            return null
    }
}