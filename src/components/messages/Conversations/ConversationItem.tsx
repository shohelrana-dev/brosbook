import React from 'react'
import Link from "next/link"
import { Conversation } from "@interfaces/conversation.interfaces"
import Avatar from "@components/global/Avatar"
import useAuthState from "@hooks/useAuthState"
import timeAgo from "@utils/timeAgo"
import TextOverflow from 'react-text-overflow'
import Image from "next/image"
import {IoCheckmarkCircleOutline as TickIcon} from "react-icons/io5"

const classes = {
    box            : `box block cursor-pointer py-2 px-3 flex mb-3 w-full gap-3`,
    name           : `font-medium text-gray-900`,
    nameWrapper    : `flex items-center gap-3`,
    date           : `text-gray-800 text-xs`,
    messageWrapper : `flex justify-between mt-1`,
    messageText    : ( isBold: boolean ) => `text-sm text-gray-700 ${isBold && '!font-bold !text-gray-900'}`,
    image          : `rounded-full h-[15px] w-[15px]`
}

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
            <div className={classes.box}>
                <div>
                    <Avatar
                        online={active}
                        alt={fullName}
                        src={avatar?.url}
                    />
                </div>
                <div className="w-full">
                    <h3 className={classes.nameWrapper}>
                        <h3 className={classes.name}>
                            {fullName}
                        </h3>
                        <p className={classes.date}>
                            {timeAgo(lastMessage?.createdAt!)}
                        </p>
                    </h3>
                    <div className={classes.messageWrapper}>
                        <p className={classes.messageText(!isLastMessageSenderMe && !lastMessage?.seenAt)}>
                            {messageBody ? <TextOverflow text={messageBody}/> : null}
                        </p>
                        {isLastMessageSenderMe ? (
                            lastMessage?.seenAt ?
                                <Image
                                    src={avatar.url}
                                    alt={fullName}
                                    width={15}
                                    height={15}
                                    className={classes.image}
                                /> : <TickIcon size={17}/>
                        ) : (
                            unreadMessagesCount ? (
                                <p className="bg-theme-green text-white rounded-full w-[18px] h-[18px] flex flex-wrap justify-center items-center text-xs font-bold">
                                    {unreadMessagesCount}
                                </p>
                            ) : null
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}