"use client"
import React, { PropsWithChildren } from 'react'
import useCurrentUser from "@hooks/useCurrentUser"
import TabLinkList from "@components/common/TabLinkList"
import Avatar from "@components/common/Avatar"
import Loading from "@components/common/Loading"
import SidebarLayout from "@components/common/SidebarLayout"

const tabLinks = [
    { label: 'Account', pathname: '/account' },
    { label: 'Profile', pathname: '/account/profile' }
]

export default function AccountLayout( { children }: PropsWithChildren ){
    const { user, isAuthenticated } = useCurrentUser( { redirectTo: '/auth/login' } )

    if( ! isAuthenticated ) return <Loading/>

    return (
        <SidebarLayout>
            <div className="bg-white p-5">
                <TabLinkList links={ tabLinks }/>
                <div className="flex items-center mt-5">
                    <div className="w-3/12 flex justify-end p-4">
                        <Avatar src={ user?.avatar.url } alt={ user?.username }/>
                    </div>
                    <div className="flex-auto p-4">
                        <h3 className="text-xl">{ user?.username }</h3>
                    </div>
                </div>
                { children }
            </div>
        </SidebarLayout>
    )
}