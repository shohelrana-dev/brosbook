"use client"
import React, {PropsWithChildren} from 'react'
import useUser from "@hooks/useUser"
import TabLinkList from "@components/common/TabLinkList"
import Avatar from "@components/common/Avatar"

const tabLinks = [
    {label: 'Account', pathname: '/account'},
    {label: 'Profile', pathname: '/account/profile'}
]

export default function AccountLayout({children}:PropsWithChildren) {
    const {user} = useUser({redirectTo: '/auth/login'})


    return (
        <div className="bg-white p-5">
            <TabLinkList links={tabLinks}/>
            <div className="flex items-center mt-5">
                <div className="w-3/12 flex justify-end p-4">
                    <Avatar src={user?.photo} alt={user?.username} />
                </div>
                <div className="flex-auto p-4">
                    <h3 className="text-xl">{user?.username}</h3>
                </div>
            </div>
            {children}
        </div>
    )
}