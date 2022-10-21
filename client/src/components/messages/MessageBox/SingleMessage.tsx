import React  from 'react'
import moment from "moment"

import Avatar         from "@components/common/Avatar"
import { Message }    from "@interfaces/chat.interfaces"
import { User }       from "@interfaces/user.interfaces"
import MessageContent from "@components/messages/MessageBox/MessageContent"

//the component classes
const classes = {
    ownRow: 'flex items-end float-right mb-6 max-w-[70%]',
    partnerRow: 'flex items-end float-left mb-6 max-w-[70%]',
    ownMessageWrap: 'w-full mr-4',
    partnerMessageWrap: 'w-full ml-4',
    date: 'text-gray-500 text-center text-sm',
    time: 'text-gray-500 text-xs'
}


interface SingleMessageProps {
    message: Message
    participant: User
    currentUser: User
    group: Message[]
}

function SingleMessage( { message, participant, group, currentUser }: SingleMessageProps ) {

    const messageSender = currentUser.id === message.senderId ? currentUser : participant || {} as User
    const isOwnMessage  = currentUser.id === message.senderId

    //message date
    let messageDate = ''
    const hoursDiff = moment( Date.now() ).diff( message.createdAt, 'hours' )
    if ( hoursDiff > 24 ) {
        messageDate = moment( message.createdAt ).format( 'DDDo MMM YY' )
    }

    const avatarMarkup = (
        <Avatar
            online={ messageSender.active === 1 }
            alt={ messageSender.fullName }
            src={ messageSender.photo }
            size="small"
        />
    )


    return (
        <div>
            <div className={ classes.date }>
                { messageDate }
            </div>

            { isOwnMessage && (
                <div className={ classes.ownRow }>
                    <div className={ classes.ownMessageWrap }>
                        { group.length > 0 ? group.map( ( msg, key ) => (
                            <MessageContent isOwnMessage={ isOwnMessage } message={ msg } key={ key }/>
                        ) ) : (
                            <MessageContent isOwnMessage={ isOwnMessage } message={ message }/>
                        ) }
                        <time className={ classes.time }>
                            { moment( message.createdAt ).format( 'hh:mm A' ) }
                        </time>
                    </div>
                    { avatarMarkup }
                </div>
            ) }

            <div className="clear-both"/>

            { !isOwnMessage && (
                <div className={ classes.partnerRow }>
                    { avatarMarkup }
                    <div className={ classes.partnerMessageWrap }>
                        { group.length > 0 ? group.map( ( msg, key ) => (
                            <MessageContent isOwnMessage={ isOwnMessage } message={ msg } key={ key }/>
                        ) ) : (
                            <MessageContent isOwnMessage={ isOwnMessage } message={ message }/>
                        ) }
                        <time className={ classes.time }>
                            { moment( message.createdAt ).format( 'hh:mm A' ) }
                        </time>
                    </div>
                </div>
            ) }

        </div>
    )
}

export default SingleMessage