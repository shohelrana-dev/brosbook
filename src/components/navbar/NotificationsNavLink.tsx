import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react"
import IconButton from "@components/global/IconButton"
import { IoNotificationsOutline as NotificationIcon } from "react-icons/io5"
import NotificationList from "@components/notifications/NotificationList"
import { useGetUnreadNotificationsCountQuery, useReadAllNotificationMutation } from "@services/notificationsApi"
import { io } from "socket.io-client"
import { baseApi } from "@services/baseApi"
import useAuthState from "@hooks/useAuthState"
import { useDispatch } from "react-redux"

export default function NotificationsNavLink(){
    const { user }                                                = useAuthState()
    const dispatch                                                = useDispatch()
    const { data: unreadNotifications }                           = useGetUnreadNotificationsCountQuery()
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>( unreadNotifications?.count || 0 )
    const [readAllNotification]                                   = useReadAllNotificationMutation()

    useEffect( () => {
        setUnreadNotificationsCount( unreadNotifications?.count! )
    }, [unreadNotifications] )

    useEffect( () => {
        if( ! user?.id ) return

        const socket = io( process.env.NEXT_PUBLIC_SERVER_BASE_URL! )

        socket.on( 'connect', () => {
            socket.on( `notification.unread.count.${ user?.id }`, ( count ) => {
                setUnreadNotificationsCount( count )
                dispatch( baseApi.util.invalidateTags( ['Notification'] ) )
            } )
        } )

        if( socket ) return () => {
            socket.close()
        }
    }, [user] )

    function onNotificationsCLick(){
        readAllNotification()
    }

    return (
        <Popover>
            <PopoverHandler>
                <div>
                    <IconButton className="p-5 block relative" onClick={ onNotificationsCLick }>
                        { unreadNotificationsCount ? (
                            <div
                                className="absolute top-[-5px] right-0 bg-red-500 text-white rounded-full font-bold p-[2px] h-[18px] w-[18px]">
                                { unreadNotificationsCount }
                            </div>
                        ) : null }
                        <NotificationIcon size={ 25 } className="text-gray-700"/>
                    </IconButton>
                </div>
            </PopoverHandler>
            <PopoverContent className="w-full max-w-[350px] z-50 p-2">
                <div className="max-h-[500px] overflow-y-auto">
                    <NotificationList/>
                </div>
            </PopoverContent>
        </Popover>
    )
}