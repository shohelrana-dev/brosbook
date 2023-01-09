"use client"
import React from 'react'
import Conversations from "@components/messages/Conversations"
import ParticipantInfo from "@components/messages/ParticipantInfo"
import useCurrentUser from "@hooks/useCurrentUser"
import MediaQuery from 'react-responsive'
import MessageBox from "@components/messages/MessageBox"

interface Props {
    params: { conversationId: string }
}

function Page( { params }: Props ){
    const {} = useCurrentUser( { redirectTo: '/auth/login' } )

    return (
        <div className="h-screen grid grid-cols-12 md:px-10 sm:px-4 pt-16 -mt-16 bg-theme-gray">
            <MediaQuery minWidth={ 1024 }>
                <div className="col-span-12 lg:col-span-3 p-5 h-full lg:border-r-2 border-gray-20 none">
                    <Conversations/>
                </div>
            </MediaQuery>

            <div className="col-span-12 lg:col-span-6 p-5 relative overflow-hidden flex flex-col">
                <MessageBox conversationId={ params.conversationId }/>
            </div>

            <MediaQuery minWidth={ 1024 }>
                <div className="col-span-3 p-5 border-l-2 border-gray-200">
                    <ParticipantInfo conversationId={ params.conversationId }/>
                </div>
            </MediaQuery>
        </div>
    )
}

export default Page