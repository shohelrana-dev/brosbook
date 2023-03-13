"use client"
import React from 'react'
import Link from "next/link"
import Avatar from "@components/global/Avatar"
import MessageList from "@components/messages/MessageBox/MessageList"
import CreateMessageForm from "@components/messages/MessageBox/CreateMessageForm"
import timeAgo from "@utils/timeAgo"
import Loading from "@components/global/Loading"
import { useGetConversationByIdQuery } from "@services/conversationApi"
import IconButton from "@components/global/IconButton"
import { BiInfoCircle as InfoIcon } from "react-icons/bi"
import Modal from "@components/global/Modal"
import ParticipantInfo from "@components/messages/ParticipantInfo"
import useModal from "@hooks/useModal"

interface Props {
    conversationId: string
}

export default function MessageBox( { conversationId }: Props ){
    //hooks
    const { data: conversation, isLoading } = useGetConversationByIdQuery( conversationId )
    const { isVisible, toggle }             = useModal()

    if( isLoading ) return <Loading/>

    const participant = conversation?.participant

    return (
        <div className="flex flex-col relative h-full">
            <Modal isVisible={ isVisible } toggle={ toggle } hideIcon
                   className="max-h-[85vh] bg-theme-gray overflow-hidden !p-0">
                <ParticipantInfo conversationId={ conversationId }/>
            </Modal>

            {/*User top bar*/ }
            <div className="box py-3 px-4 lg:px-6 flex justify-between">
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
                <div className="self-center" onClick={ toggle }>
                    <IconButton>
                        <InfoIcon size={ 25 }/>
                    </IconButton>
                </div>
            </div>

            {/*Messages*/ }
            <MessageList conversation={ conversation! }/>

            {/*message form*/ }
            <CreateMessageForm conversation={ conversation! }/>

        </div>
    )
}