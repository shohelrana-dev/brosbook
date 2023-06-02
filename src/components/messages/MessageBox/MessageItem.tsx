import React from 'react'
import Avatar from "@components/global/Avatar"
import { Message } from "@interfaces/conversation.interfaces"
import MessageContent from "@components/messages/MessageBox/MessageContent"
import timeAgo from "@utils/timeAgo"
import moment from "moment/moment"
import { IoCheckmarkCircleOutline as TickIcon } from "react-icons/io5"
import { BsCircle as CircleIcon } from "react-icons/bs"
import Image from "next/image"
import { User } from "@interfaces/user.interfaces"
import tw from "twin.macro"
import { Flex } from "@components/styles/Global.styles"

const OwnRow             = tw.div`flex items-end float-right mb-2 max-w-[70%]`
const PartnerRow         = tw.div`flex items-end float-left mb-1 max-w-[70%]`
const OwnMessageWrap     = tw.div`w-full`
const PartnerMessageWrap = tw.div`w-full`
const Time               = tw.div`text-gray-500 text-xs`


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
            online={ message.sender.active }
            alt={ message.sender.fullName }
            src={ message.sender.avatar.url }
            size="small"
        />
    )

    return (
        <div>
            { message.isMeSender ? (
                <OwnRow>
                    <OwnMessageWrap>
                        <Flex>
                            <MessageContent message={ message }/>
                            <div className="min-w-[20px] self-end ml-1">
                                { isLastMessage ? (
                                    message.seenAt ? (
                                        <Image
                                            src={ participant?.avatar.url }
                                            alt={ "User photo" }
                                            width={ 15 }
                                            height={ 15 }
                                            className="h-[16px] w-[16px] object-cover rounded-full"
                                        />
                                    ) : (
                                        <p className="text-gray-600">
                                            {message.createdAt ? <TickIcon size={ 17 }/> : <CircleIcon size={14}/>}
                                        </p>
                                    )
                                ) : null }
                            </div>
                        </Flex>
                        <div className="flex justify-between">
                            { ! isSameUserAndTimeLessThanFiveMin && message.createdAt ?
                                <Time>{ timeAgo( message.createdAt ) }</Time> : null }
                        </div>
                    </OwnMessageWrap>
                </OwnRow>
            ) : null }

            <div className="clear-both"/>

            { ! message.isMeSender ? (
                <PartnerRow>
                    <div className="min-w-[35px] mr-3">
                        { ! isSameUserAndTimeLessThanFiveMin ? avatarMarkup : null }
                    </div>
                    <PartnerMessageWrap>
                        <MessageContent message={ message }/>
                        { ! isSameUser && message.createdAt ? <Time>{ timeAgo( message.createdAt ) }</Time> : null }
                    </PartnerMessageWrap>
                </PartnerRow>
            ) : null }

        </div>
    )
}

export default MessageItem