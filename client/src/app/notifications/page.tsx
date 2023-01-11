"use client"
import React from 'react'
import useCurrentUser from "@hooks/useCurrentUser"
import NotificationList from "@components/notifications/NotificationList"
import Loading from "@components/common/Loading"
import SidebarLayout from "@components/common/SidebarLayout"

export default function NotificationPage(){
    const { isAuthenticated } = useCurrentUser( { redirectTo: '/auth/login' } )

    if( ! isAuthenticated ) return <Loading/>

    return (
        <SidebarLayout>
            <div className="box py-6 px-4">
                <NotificationList/>
            </div>
        </SidebarLayout>
    )
}