import React, { useEffect, useState } from 'react'
import IconButton from "@components/global/IconButton"
import { IoMailOutline as MessageIcon } from "react-icons/io5"
import Link from "next/link"
import { io } from "socket.io-client"
import { baseApi } from "@services/baseApi"
import useAuthState from "@hooks/useAuthState"
import { useGetUnreadConversationsCountQuery } from "@services/conversationsApi"
import { useDispatch } from "react-redux"

export default function MessagesNavLink(){
    const { user }                                                = useAuthState()
    const dispatch                                                = useDispatch()
    const { data: unreadConversations }                           = useGetUnreadConversationsCountQuery()
    const [unreadConversationsCount, setUnreadConversationsCount] = useState<number>( unreadConversations?.count || 0 )

    useEffect( () => {
        setUnreadConversationsCount( unreadConversations?.count! )
    }, [unreadConversations] )

    useEffect( () => {
        if( ! user?.id ) return

        const socket = io( process.env.NEXT_PUBLIC_SERVER_BASE_URL! )

        socket.on( 'connect', () => {
            socket.on( `conversation.unread.count.${ user?.id }`, ( count ) => {
                setUnreadConversationsCount( count )
                dispatch( baseApi.util.invalidateTags( ['Conversation'] ) )
            } )
        } )

        if( socket ) return () => {
            socket.close()
        }
    }, [user] )

    return (
        <Link href="/messages" className="block">
            <IconButton className="p-5">
                { unreadConversationsCount ? (
                    <div
                        className="absolute top-[-5px] right-[-5px] bg-red-500 text-white rounded-full font-bold p-[2px] h-[18px] w-[18px]">
                        { unreadConversationsCount }
                    </div>
                ) : null }
                <MessageIcon size={ 25 } className="text-gray-700"/>
            </IconButton>
        </Link>
    )
}