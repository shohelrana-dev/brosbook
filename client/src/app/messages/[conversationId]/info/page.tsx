"use client"
import React from 'react'
import ParticipantInfo from "@components/messages/ParticipantInfo"

interface Props {
    params: { conversationId: string }
}

function Page( { params }: Props ){
    return (
        <div className="max-w-[500px] mx-auto mt-3">
            <ParticipantInfo conversationId={ params.conversationId }/>
        </div>
    )
}

export default Page