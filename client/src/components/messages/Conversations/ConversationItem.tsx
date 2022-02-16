import React      from 'react'
import classNames from "classnames"
import moment     from "moment"
import Link       from "next/link"

import { Conversation } from "@interfaces/chat.interfaces"
import { shortText }    from "@utils/index"
import Avatar           from "@components/common/Avatar"

interface SingleConversationProps {
    conversation: Conversation
}

function ConversationItem( { conversation }: SingleConversationProps ) {
    return (
        <Link href={ `/messages/${ conversation.identifier }` }>
            <a className="box block cursor-pointer py-2 px-3 flex mb-3">
                <div className="mr-3">
                    <Avatar
                        online={ conversation.participant.active === 1 }
                        alt={ conversation.participant.fullName }
                        src={ conversation.participant.photo }
                    />
                </div>
                <div className="mr-3">
                    <h5 className="font-medium text-gray-800">
                        { conversation.participant.fullName }
                    </h5>
                    <p className={ classNames( 'text-sm', {
                        "font-bold text-gray-800": !conversation.seen,
                        "text-gray-500": conversation.seen
                    } ) }>
                        { shortText( conversation.lastMessage!, 30 ) }
                    </p>
                </div>
                <div>
                    <small className="text-gray-800">
                        { moment( conversation.updatedAt ).fromNow(true) }
                    </small>
                </div>
            </a>
        </Link>
    )
}

export default ConversationItem