import React from 'react'
import Link from "next/link"
import { Conversation } from "@interfaces/conversation.interfaces"
import Avatar from "@components/global/Avatar"
import useAuthState from "@hooks/useAuthState"
import timeAgo from "@utils/timeAgo"
import TextOverflow from 'react-text-overflow'
import Image from "next/image"
import tw, { styled } from "twin.macro"
import { Box as BaseBox } from "@components/styles/Global.styles"
import {IoCheckmarkCircleOutline as TickIcon} from "react-icons/io5"

const Box            = tw( BaseBox )`block cursor-pointer py-2 px-3 flex mb-3 w-full gap-3`
const Name           = tw.h3`font-medium text-gray-900`
const NameWrapper    = tw.h3`flex gap-3`
const Date           = tw.p`text-gray-800 text-xs`
const MessageWrapper = tw.div`flex justify-between mt-1`
const MessageText    = styled.p( ( { bold }: { bold: boolean } ) => [
    tw`text-sm text-gray-700`,
    bold && tw`!font-bold !text-gray-900`
] )
const StyledImage    = tw( Image )`rounded-full h-[15px] w-[15px]`

interface Props {
    conversation: Conversation
}

export default function ConversationItem( { conversation }: Props ) {
    const {user: currentUser} = useAuthState()

    const { lastMessage, unreadMessagesCount, participant } = conversation || {}
    const { fullName, active, avatar } = participant || {}
    const isLastMessageSenderMe = lastMessage && lastMessage.sender.id === currentUser?.id
    let messageBody

    if (lastMessage?.body) {
        messageBody = lastMessage.body
    } else if (lastMessage?.image) {
        messageBody = 'Sent photo'
    }
    if (messageBody) {
        messageBody = isLastMessageSenderMe ? `You: ${messageBody}` : messageBody
    }

    return (
        <Link href={`/messages/${conversation.id}`}>
            <Box>
                <div>
                    <Avatar
                        online={active}
                        alt={fullName}
                        src={avatar?.url}
                    />
                </div>
                <div className="w-full">
                    <NameWrapper>
                        <Name>{fullName}</Name>
                        <Date>
                            {timeAgo(lastMessage?.createdAt!)}
                        </Date>
                    </NameWrapper>
                    <MessageWrapper>
                        <MessageText bold={!isLastMessageSenderMe && !lastMessage?.seenAt}>
                            {messageBody ? <TextOverflow text={messageBody}/> : null}
                        </MessageText>
                        {isLastMessageSenderMe ? (
                            lastMessage?.seenAt ?
                                <StyledImage
                                    src={avatar.url}
                                    alt={fullName}
                                    width={15}
                                    height={15}
                                /> : <TickIcon size={17}/>
                        ) : (
                            unreadMessagesCount ? (
                                <p className="bg-theme-green text-white rounded-full w-[18px] h-[18px] flex flex-wrap justify-center items-center text-xs font-bold">
                                    {unreadMessagesCount}
                                </p>
                            ) : null
                        )}
                    </MessageWrapper>
                </div>
            </Box>
        </Link>
    )
}