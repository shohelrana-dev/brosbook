"use client"
import React, {PropsWithChildren} from 'react'
import useAuth from "@hooks/useAuth"
import TabLinkList from "@components/common/TabLinkList"
import Avatar from "@components/common/Avatar"

const tabLinks = [
    {title: 'Account', link: '/account'},
    {title: 'Profile', link: '/account/profile'}
]

export default function AccountLayout({children}:PropsWithChildren) {
    const {user} = useAuth('/auth/login')


    return (
        <div className="bg-white p-5">
            <TabLinkList links={tabLinks}/>
            <div className="flex items-center">
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