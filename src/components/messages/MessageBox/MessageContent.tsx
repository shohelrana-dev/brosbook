import React from 'react'
import Reactions from "@components/messages/MessageBox/Reactions"
import { Message } from "@interfaces/conversation.interfaces"
import ImageLightbox from "@components/global/ImageLightbox"
import moment from "moment"
import tw, { styled } from "twin.macro"
import { Box } from "@components/styles/Global.styles"
import Linkify from 'linkify-react'

const TextMessage  = styled(Box)(( { isOwn, hasReaction }: { isOwn: boolean, hasReaction: boolean } ) => [
    tw`relative py-2 px-4 my-1 flex items-end gap-1  flex-wrap`,
    isOwn ? tw`bg-theme-green text-white [a]:text-blue-100` : tw`bg-white text-gray-700 [a]:text-blue-500`,
    hasReaction ? tw`mb-3` : tw`mb-0`,
])
const EmojiMessage = styled.div(( { hasReaction }: { hasReaction: boolean } ) => [
    tw`relative pt-2 text-3xl flex items-end gap-1 text-gray-700 flex-wrap`,
    hasReaction ? tw`mb-3` : tw`mb-0`
])
const ImageMessage = tw.div`relative max-w-[200px] mb-4 flex items-end gap-1 text-gray-700 flex-wrap`
const Time         = tw.time`text-[10px]`

interface Props {
    message: Message
}

function MessageContent( { message }: Props ) {

    const { type, isMeSender, body, image, reactions, createdAt } = message
    const hasReaction                                             = reactions?.length > 0

    switch ( type ) {
        case 'text':
            return (
                <TextMessage hasReaction={ hasReaction } isOwn={ isMeSender }>
                    <Reactions message={ message }/>
                    <span>
                        <Linkify >{ body }</Linkify>
                    </span>
                    <Time>{ moment(createdAt).format("h:mm a") }</Time>
                </TextMessage>
            )

        case 'emoji':
            return (
                <EmojiMessage hasReaction={ hasReaction }>
                    <Reactions message={ message }/>
                    { body }
                    <Time>{ moment(createdAt).format("h:mm a") }</Time>
                </EmojiMessage>
            )

        case 'image':
            return (
                <ImageMessage>
                    <Reactions message={ message }/>
                    <ImageLightbox image={ image } alt="message image" width={ 400 } height={ 400 }/>
                    <Time>{ moment(createdAt).format("h:mm a") }</Time>
                </ImageMessage>
            )

        default:
            return null
    }
}

export default MessageContent