import React from 'react'
import Avatar from "@components/global/Avatar"
import { Message } from "@interfaces/conversation.interfaces"
import MessageContent from "@components/messages/MessageBox/MessageContent"
import useAuthState from "@hooks/useAuthState"
import timeAgo from "@utils/timeAgo"
import moment from "moment/moment"
import { TiTick as TickIcon } from "react-icons/ti"
import Image from "next/image";

//the component classes
const classes = {
    ownRow: 'flex items-end float-right mb-2 max-w-[70%]',
    partnerRow: 'flex items-end float-left mb-1 max-w-[70%]',
    ownMessageWrap: 'w-full mr-4',
    partnerMessageWrap: 'w-full ml-4',
    date: 'text-gray-500 text-center text-sm',
    time: 'text-gray-500 text-xs'
}


interface SingleMessageProps {
    message: Message
    prevMessage: Message | null
    isLastMessage: boolean
}

function SingleMessage( { message, prevMessage, isLastMessage }: SingleMessageProps ){
    const { user: currentUser } = useAuthState()

    const avatarMarkup = (
        <Avatar
            online={ message.sender.active === 1 }
            alt={ message.sender.fullName }
            src={ message.sender.avatar.url }
            size="small"
        />
    )

    const timeDiff                         = moment( prevMessage?.createdAt ).diff( message.createdAt, "minutes" )
    const isSameUser                       = prevMessage && ( message.sender.id === prevMessage?.sender.id )
    const isSameUserAndTimeLessThanFiveMin = isSameUser && ( timeDiff <= 5 )

    return (
        <div>

            { message.isMeSender ? (
                <div className={ classes.ownRow }>
                    <div className={ classes.ownMessageWrap }>
                        <div className="flex">
                            <MessageContent message={ message }/>
                            <div className="min-w-[35px] self-end ml-2">
                                { isLastMessage ? (
                                    message.seenAt ? (
                                        <Image
                                            src={ currentUser?.avatar.url }
                                            alt={ "User photo" }
                                            width={ 18 }
                                            height={ 18 }
                                            className="h-[18px] object-cover rounded-full"
                                        />
                                    ) : (
                                        <div className="relative text-gray-700">
                                            <TickIcon size={ 18 }/>
                                            <TickIcon size={ 18 } className="absolute left-[5px] top-0"/>
                                        </div>
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
                    <div className="min-w-[35px]">
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

export default SingleMessage