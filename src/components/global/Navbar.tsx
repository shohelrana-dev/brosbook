"use client"
import React, { useEffect, useState } from 'react'
import Link from "next/link"
import { IoMailOutline as MessageIcon } from "react-icons/io5"
import { RiUserSettingsFill as SettingIcon } from "react-icons/ri"
import { FaSignOutAlt as LogoutIcon } from "react-icons/fa"
import { AiOutlineHome as HomeIcon } from "react-icons/ai"
import Avatar from "@components/global/Avatar"
import {
    Navbar as BaseNavbar,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem
} from "@material-tailwind/react"
import IconButton from "@components/global/IconButton"
import { IoNotificationsOutline as NotificationIcon } from "react-icons/io5"
import { useGetUnreadNotificationsCountQuery, useReadAllNotificationMutation } from "@services/notificationsApi"
import { io } from "socket.io-client"
import {
    Popover,
    PopoverHandler,
    PopoverContent,
} from "@material-tailwind/react"
import NotificationList from "@components/notifications/NotificationList"
import useConfirmAlert from "@hooks/useConfirmAlert"
import { useRouter } from "next/navigation"
import { useGetUnreadConversationsCountQuery } from "@services/conversationApi"
import useAuthState from "@hooks/useAuthState"
import { getCookie } from "tiny-cookie"
import ExpandableSearch from "@components/global/ExpandableSearch"

interface Props {
    hasAccessToken: boolean
}

function NavBar( props: Props ){
    const [hasAccessToken, setHasAccessToken]                     = useState<boolean>( props.hasAccessToken )
    const { user }                                                = useAuthState()
    const [readAllNotification]                                   = useReadAllNotificationMutation()
    const { data: unreadNotifications }                           = useGetUnreadNotificationsCountQuery()
    const { data: unreadConversations }                           = useGetUnreadConversationsCountQuery()
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>( unreadNotifications?.count || 0 )
    const [unreadConversationsCount, setUnreadConversationsCount] = useState<number>( unreadConversations?.count || 0 )
    const confirmAlert                                            = useConfirmAlert()
    const router                                                  = useRouter()

    useEffect( () => {
        setHasAccessToken( !! getCookie( 'access_token' ) )
    }, [user] )

    useEffect( () => {
        setUnreadNotificationsCount( unreadNotifications?.count! )
    }, [unreadNotifications] )

    useEffect( () => {
        setUnreadConversationsCount( unreadConversations?.count! )
    }, [unreadConversations] )

    useEffect( () => {
        const socket = io( process.env.NEXT_PUBLIC_SERVER_BASE_URL! )

        socket.on( `unread_notification_count_${ user?.id }`, ( count ) => {
            setUnreadNotificationsCount( count )
        } )

        socket.on( `unread_conversation_count_${ user?.id }`, ( count ) => {
            setUnreadConversationsCount( count )
        } )

        if( socket ) return () => {
            socket.close()
        }
    }, [user] )

    function onNotificationsCLick(){
        readAllNotification()
    }

    async function onLogoutCLick(){
        const isOk = await confirmAlert( {
            title: `Log out of ${ process.env.NEXT_PUBLIC_APP_NAME }?`,
            message: 'You can always log back in at any time. And you can switch another account.',
            confirmButtonLabel: 'Log out',
        } )

        if( isOk ){
            router.push( '/auth/logout' )
        }
    }

    if( ! hasAccessToken ) return null

    return (
        <header id="appHeader" className="relative z-10">
            <BaseNavbar fullWidth className="mx-auto px-4 lg:px-8 py-2 lg:py-4 z-20">
                <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
                    <div className="mr-1">
                        <Link href="/">
                            <IconButton className="p-5">
                                <HomeIcon size={ 27 }/>
                            </IconButton>
                        </Link>
                    </div>

                    <div className="flex">
                        <div className="mr-2 flex">
                            <ExpandableSearch/>
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
                        </div>
                        <Menu>
                            <MenuHandler>
                                <button className="rounded-full">
                                    <Avatar src={ user?.avatar?.url } size="small"/>
                                </button>
                            </MenuHandler>
                            <MenuList>
                                <MenuItem className="py-0 mb-2">
                                    <Link href={ `/${ user?.username }` }
                                          className="flex py-2 gap-2 border-b-2 border-gray-50">
                                        <Avatar src={ user?.avatar?.url } size="small"/>
                                        <div>
                                            <p>{ user?.fullName }</p>
                                            <p className="text-xs">Your profile</p>
                                        </div>
                                    </Link>
                                </MenuItem>
                                <MenuItem className="py-0">
                                    <Link href="/account" className="block py-2">
                                        <SettingIcon className="inline-block mr-2" size={ 20 }/>
                                        Settings
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={ onLogoutCLick }>
                                    <LogoutIcon className="inline-block mr-2" size={ 20 }/>
                                    Logout
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </div>
                </div>
            </BaseNavbar>
        </header>
    )
}

export default NavBar