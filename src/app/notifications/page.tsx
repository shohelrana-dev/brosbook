import React from 'react'
import NotificationList from "@components/notifications/NotificationList"
import SidebarLayout from "@components/global/SidebarLayout"

export default function NotificationPage(){
    return (
        <SidebarLayout>
            <div className="box py-6 px-4">
                <NotificationList/>
            </div>
        </SidebarLayout>
    )
}