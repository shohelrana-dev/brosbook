import React from 'react'
import classNames from "classnames"
import Link from "next/link"
import { Conversation } from "@interfaces/conversation.interfaces"
import Avatar from "@components/common/Avatar"
import useAuthState from "@hooks/useAuthState"
import timeAgo from "@utils/timeAgo"
import TextOverflow from 'react-text-overflow'
import { useSeenAllMessagesMutation } from "@services/conversationApi"

interface SingleConversationProps {
    conversation: Conversation
}

function ConversationItem( { conversation }: SingleConversationProps ){
    const { user: currentUser } = useAuthState()
    const [seenAllMessages]     = useSeenAllMessagesMutation()


    const participant = conversation?.user1.id === currentUser?.id ? conversation?.user2 : conversation?.user1

    return (
        <Link href={ `/messages/${ conversation.id }` } onClick={ () => seenAllMessages( conversation.id ) }
              className="box block cursor-pointer py-2 px-3 flex mb-3">
            <div className="mr-3">
                <Avatar
                    online={ participant.active === 1 }
                    alt={ participant.fullName }
                    src={ participant.avatar.url }
                />
            </div>
            <div className="mr-3">
                <h5 className="font-medium text-gray-800">
                    { participant.fullName }
                </h5>
                <p className={ classNames( 'text-sm', {
                    "font-bold text-gray-800": ! conversation?.lastMessage?.seenAt,
                    "text-gray-500": conversation?.lastMessage?.seenAt
                } ) }>
                    <TextOverflow text={ conversation.lastMessage?.body! }/>
                    { conversation.lastMessage?.image ? 'Photo' : null }
                </p>
            </div>
            <div>
                <small className="text-gray-800">
                    { timeAgo( conversation?.lastMessage?.createdAt! ) }
                </small>
            </div>
        </Link>
    )
}

export default ConversationItem