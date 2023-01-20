import React, { ReactNode } from 'react'
import Link from "next/link"
import { GoLocation } from "react-icons/go"
import { HiOutlineCake } from "react-icons/hi"
import { MdOutlineSchedule } from "react-icons/md"

import FollowButton from "@components/common/FollowButton"
import { http } from "@boot/axios"
import { cookies } from "next/headers"
import { User } from "@interfaces/user.interfaces"
import TabLinkList from "@components/common/TabLinkList"
import getAuthorizationConfig from "@utils/getAuthorizationConfig"
import ButtonOutline from "@components/common/ButtonOutline"
import CoverPhoto from "@components/profile/CoverPhoto"
import ProfilePhoto from "@components/profile/ProfilePhoto"
import NotFound from "../not-found"
import SidebarLayout from "@components/common/SidebarLayout"

interface ProfileLayoutProps {
    children: ReactNode
    params: {
        username: string
    }
}

export const revalidate = 0

export default async function ProfileLayout( { children, params }: ProfileLayoutProps ){
    const config     = getAuthorizationConfig( cookies() )
    const user: User = await http.get( `/users/by/username/${ params.username }`, config ).then( ( res ) => res.data ).catch( () => null )

    if( ! user ) return <NotFound/>

    const currentUser: User       = await http.get( `/users/me`, config ).then( ( res ) => res.data ).catch( () => null )
    const followersCount: number  = await http.get( `/users/${ user?.id }/followers/count` ).then( ( res ) => res.data?.count ).catch( () => 0 )
    const followingsCount: number = await http.get( `/users/${ user?.id }/followings/count` ).then( ( res ) => res.data?.count ).catch( () => 0 )

    const tabLinks = [
        { label: "Posts", pathname: `/${ user?.username }` },
        { label: "Followers", pathname: `/${ user?.username }/followers` },
        { label: "Following", pathname: `/${ user?.username }/following` },
        { label: "Media", pathname: `/${ user?.username }/media` }
    ]

    return (
        <SidebarLayout>
            <div>
                <div className="bg-white pb-5 mb-3">
                    <div>
                        <CoverPhoto user={ user }/>
                        <div className="p-4 flex justify-between relative z-10">
                            <ProfilePhoto user={ user }/>

                            { currentUser && currentUser?.username !== user?.username ? (
                                <div>
                                    <FollowButton user={ user! }/>
                                </div>
                            ) : null }
                            { currentUser && currentUser?.username === user?.username ? (
                                <ButtonOutline className="flex h-[35px] items-center">
                                    <Link href="/account/profile">
                                        Edit Profile
                                    </Link>
                                </ButtonOutline>
                            ) : null }
                        </div>
                    </div>

                    <div className="px-2 sm:px-6">
                        <div>
                            <h2 className="text:lg md:text-xl font-bold">{ user?.fullName }</h2>
                            <p className="text-gray-600 mb-2">@{ user?.username }</p>
                            <div>{ user?.profile?.bio }</div>
                        </div>
                        <ul className="mt-4">
                            { user?.profile?.location && (
                                <li className="text-gray-600 inline-block mr-3 mb-1">
                                    <GoLocation className="inline-block text-lg"/>&nbsp;
                                    { user?.profile?.location }
                                </li>
                            ) }
                            { user?.profile?.birthdate && (
                                <li className="text-gray-600 inline-block mr-3 mb-1">
                                    <HiOutlineCake className="inline-block text-lg"/>&nbsp;
                                    Born { new Date( user?.profile?.birthdate ).toLocaleDateString( 'en-us', {
                                    day: "numeric",
                                    year: "numeric",
                                    month: "short"
                                } ) }
                                </li>
                            ) }
                            <li className="text-gray-600 inline-block mr-3 mb-1">
                                <MdOutlineSchedule className="inline-block text-lg"/>&nbsp;
                                Joined { new Date( user?.createdAt! ).toLocaleDateString( 'en-us', {
                                day: "numeric",
                                year: "numeric",
                                month: "short"
                            } ) }
                            </li>
                        </ul>
                        <ul className="mt-4">
                            <li className="text-gray-600 inline-block mr-3">
                                <strong>{ followingsCount }</strong> Following
                            </li>
                            <li className="text-gray-600 inline-block mr-3">
                                <strong>{ followersCount }</strong> Followers
                            </li>
                        </ul>
                    </div>


                    <TabLinkList links={ tabLinks }/>
                </div>

                { children }

            </div>
        </SidebarLayout>
    )
}
