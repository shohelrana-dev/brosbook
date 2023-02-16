import React from 'react'
import Avatar from "@components/global/Avatar"
import { Message } from "@interfaces/conversation.interfaces"
import MessageContent from "@components/messages/MessageBox/MessageContent"
import useAuthState from "@hooks/useAuthState"
import timeAgo from "@utils/timeAgo"
import moment from "moment/moment"
import { TiTickOutline as TickIcon } from "react-icons/ti"

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
                        <MessageContent message={ message }/>
                        <div className="flex justify-between">
                            { ! isSameUserAndTimeLessThanFiveMin ? (
                                <time className={ classes.time }>
                                    { timeAgo( message.createdAt ) }
                                </time>
                            ) : null }
                            { isLastMessage ? (
                                <p className="text-gray-500 text-xs">{ message.seenAt ? 'Seen' :
                                    <TickIcon size={ 20 }/> }</p>
                            ) : null }
                        </div>
                    </div>
                    <div className="min-w-[35px]">
                        { ! isSameUser ? avatarMarkup : null }
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