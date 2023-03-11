import React from 'react'
import Avatar from "@components/global/Avatar"
import { Message } from "@interfaces/conversation.interfaces"
import MessageContent from "@components/messages/MessageBox/MessageContent"
import timeAgo from "@utils/timeAgo"
import moment from "moment/moment"
import { IoCheckmarkCircleOutline as TickIcon } from "react-icons/io5"
import Image from "next/image"
import { User } from "@interfaces/user.interfaces"

//the component classes
const classes = {
    ownRow: 'flex items-end float-right mb-2 max-w-[70%]',
    partnerRow: 'flex items-end float-left mb-1 max-w-[70%]',
    ownMessageWrap: 'w-full',
    partnerMessageWrap: 'w-full',
    date: 'text-gray-500 text-center text-sm',
    time: 'text-gray-500 text-xs'
}


interface SingleMessageProps {
    message: Message
    prevMessage: Message | null
    isLastMessage: boolean
    participant: User
}

function MessageItem( { message, prevMessage, isLastMessage, participant }: SingleMessageProps ){
    const timeDiff                         = moment( prevMessage?.createdAt ).diff( message.createdAt, "minutes" )
    const isSameUser                       = prevMessage && ( message.sender.id === prevMessage?.sender.id )
    const isSameUserAndTimeLessThanFiveMin = isSameUser && ( timeDiff <= 5 )

    const avatarMarkup = (
        <Avatar
            online={ message.sender.active === 1 }
            alt={ message.sender.fullName }
            src={ message.sender.avatar.url }
            size="small"
        />
    )

    return (
        <div>

            { message.isMeSender ? (
                <div className={ classes.ownRow }>
                    <div className={ classes.ownMessageWrap }>
                        <div className="flex">
                            <MessageContent message={ message }/>
                            <div className="min-w-[20px] self-end ml-1">
                                { isLastMessage ? (
                                    message.seenAt ? (
                                        <Image
                                            src={ participant?.avatar.url }
                                            alt={ "User photo" }
                                            width={ 16 }
                                            height={ 16 }
                                            className="h-[16px] object-cover rounded-full"
                                        />
                                    ) : (
                                        <p className="text-gray-600">
                                            <TickIcon size={ 18 }/>
                                        </p>
                                    )
                                ) : null }
                            </div>
                        </div>
                        <div className="flex justify-between">
                            { ! isSameUserAndTimeLessThanFiveMin ? (
                                <time className={ classes.time }>
                                    { timeAgo( message.createdAt ) }
                                </time>
                            ) : null }
                        </div>
                    </div>
                </div>
            ) : null }

            <div className="clear-both"/>

            { ! message.isMeSender ? (
                <div className={ classes.partnerRow }>
                    <div className="min-w-[35px] mr-3">
                        { ! isSameUserAndTimeLessThanFiveMin ? avatarMarkup : null }
                    </div>
                    <div className={ classes.partnerMessageWrap }>
                        <MessageContent message={ message }/>
                        { ! isSameUser ? (
                            <time className={ classes.time }>
                                { timeAgo( message.createdAt ) }
                            </time>
                        ) : null }
                    </div>
                </div>
            ) : null }

        </div>
    )
}

export default MessageItem