import React from 'react'
import Link from "next/link"
import Avatar from "@components/common/Avatar"
import MessageList from "@components/messages/MessageBox/MessageList"
import CreateMessageForm from "@components/messages/MessageBox/CreateMessageForm"
import timeAgo from "@utils/timeAgo"
import Loading from "@components/common/Loading"
import { useGetConversationByIdQuery } from "@services/conversationApi"
import IconButton from "@components/common/IconButton"
import { BiInfoCircle as InfoIcon } from "react-icons/bi"

interface Props {
    conversationId: string
}

export default function MessageBox( { conversationId }: Props ){
    //hooks
    const { data: conversation, isLoading } = useGetConversationByIdQuery( conversationId )

    if( isLoading ) return <Loading/>

    const participant = conversation?.participant

    return (
        <>
            {/*User top bar*/ }
            <div className="box relative py-5 px-4 lg:px-8 flex justify-between">
                <div className="flex">
                    <div className="mr-4">
                        <Avatar
                            src={ participant?.avatar.url }
                            online={ participant?.active === 1 }
                            alt={ participant?.fullName }
                        />
                    </div>
                    <div className="mr-3">
                        <h5 className="font-medium text-gray-800">
                            <Link href={ `/${ participant?.username }` }>
                                { participant?.fullName }
                            </Link>
                        </h5>
                        <p className="text-gray-500 text-sm">
                            { participant?.active === 1 ? 'Active now' : 'Active ' + timeAgo( participant?.updatedAt! ) }
                        </p>
                    </div>
                </div>
                <Link href={ `/messages/${ conversationId }/info` } className="self-center">
                    <IconButton>
                        <InfoIcon size={ 25 }/>
                    </IconButton>
                </Link>
            </div>

            {/*Messages*/ }
            <MessageList conversation={ conversation! }/>

            {/*message form*/ }
            <CreateMessageForm conversation={ conversation! }/>

        </>
    )
}