import React, { PropsWithChildren } from 'react'
import TabLinkList from "@components/global/TabLinkList"
import Avatar from "@components/global/Avatar"
import SidebarLayout from "@components/global/SidebarLayout"
import { getCurrentUser } from "@services/index"
import { cookies } from "next/headers"

const tabLinks = [
    { label: 'Account', pathname: '/account' },
    { label: 'Profile', pathname: '/account/profile' }
]

export default async function AccountLayout( { children }: PropsWithChildren ){
    const user = await getCurrentUser( cookies() )

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