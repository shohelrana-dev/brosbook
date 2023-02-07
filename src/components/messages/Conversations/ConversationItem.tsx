import React from 'react'
import classNames from "classnames"
import Link from "next/link"
import { Conversation } from "@interfaces/conversation.interfaces"
import Avatar from "@components/common/Avatar"
import useAuthState from "@hooks/useAuthState"
import timeAgo from "@utils/timeAgo"
import TextOverflow from 'react-text-overflow'

interface SingleConversationProps {
    conversation: Conversation
}

function ConversationItem( { conversation }: SingleConversationProps ){
    const { user: currentUser } = useAuthState()

    const participant           = conversation?.user1.id === currentUser?.id ? conversation?.user2 : conversation?.user1
    const lastMessage           = conversation.lastMessage
    const isLastMessageSenderMe = lastMessage && lastMessage.sender.id === currentUser.id
    let messageBody

    if( lastMessage?.body ){
        messageBody = lastMessage.body
    } else if( lastMessage?.image ){
        messageBody = 'Sent photo'
    }
    if( messageBody ){
        messageBody = isLastMessageSenderMe ? `You: ${ messageBody }` : messageBody
    }

    return (
        <Link legacyBehavior={ true } href={ `/messages/${ conversation.id }` }>
            <a className="box block cursor-pointer py-2 px-3 flex mb-3">
                <div className="mr-3">
                    <Avatar
                        online={ participant.active === 1 }
                        alt={ participant.fullName }
                        src={ participant.avatar.url }
                    />
                </div>
                <div className="mr-3">
                    <h5 className="font-medium text-gray-900">
                        { participant.fullName }
                    </h5>
                    <p className={ classNames( 'text-sm text-gray-700', {
                        "!font-bold !text-gray-900": ( ! isLastMessageSenderMe && ! conversation?.lastMessage?.seenAt ) ?? false
                    } ) }>
                        { messageBody ? <TextOverflow text={ messageBody }/> : null }
                    </p>
                </div>
                <div>
                    <small className="text-gray-800">
                        { timeAgo( conversation?.lastMessage?.createdAt! ) }
                    </small>
                </div>
            </a>
        </Link>
    )
}

export default ConversationItem