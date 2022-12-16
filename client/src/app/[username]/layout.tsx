import React, { ReactNode }  from 'react'
import Link                  from "next/link"
import { GoLocation }        from "react-icons/go"
import { HiOutlineCake }     from "react-icons/hi"
import { MdOutlineSchedule } from "react-icons/md"

import FollowButton        from "@components/common/FollowButton"
import { http }            from "@boot/axios"
import { cookies }         from "next/headers"
import { User }            from "@interfaces/user.interfaces"
import TabLinkList         from "@components/common/TabLinkList"
import authorizationConfig from "@utils/authorizationConfig"
import ButtonOutline       from "@components/common/ButtonOutline"
import CoverPhoto          from "@components/profile/CoverPhoto"
import ProfilePhoto        from "@components/profile/ProfilePhoto"
import NotFound            from "../not-found"

interface ProfileLayoutProps {
    children: ReactNode
    params: { username: string }
}

export default async function ProfileLayout( { children, params }: ProfileLayoutProps ){
    const config            = authorizationConfig( cookies() )
    const currentUser: User = await http.get( `/users/me`, config ).then( ( res ) => res.data ).catch( () => null )
    const user: User        = await http.get( `/users/${ params.username }`, config ).then( ( res ) => res.data ).catch( () => null )
    const tabLinks          = [
        { label: "Posts", pathname: `/${ user?.username }` },
        { label: "Followers", pathname: `/${ user?.username }/followers` },
        { label: "Following", pathname: `/${ user?.username }/following` },
        { label: "Media", pathname: `/${ user?.username }/media` }
    ]

    if(!user) return <NotFound/>

    return (
        <div>
            <div className="bg-white pb-5 mb-3">
                <div>
                    <CoverPhoto user={ user }/>
                    <div className="p-4 flex justify-between relative z-10">
                        <ProfilePhoto user={ user }/>

                        { currentUser && currentUser?.username !== user?.username && (
                            <div>
                                <FollowButton user={ user! }/>
                            </div>
                        ) }
                        { currentUser && currentUser?.username === user?.username && (
                            <ButtonOutline className="flex h-[35px] items-center">
                                <Link href="/account/profile">
                                    Edit Profile
                                </Link>
                            </ButtonOutline>
                        ) }
                    </div>
                </div>

                <div className="px-6">
                    <div>
                        <h2 className="text-xl font-bold">{ user?.fullName }</h2>
                        <p className="text-gray-600 mb-2">@{ user?.username }</p>
                        <div>{ user?.profile?.bio }</div>
                    </div>
                    <ul className="mt-4">
                        { user?.profile?.location && (
                            <li className="text-gray-600 inline-block mr-3">
                                <GoLocation className="inline-block text-lg"/>&nbsp;
                                { user?.profile?.location }
                            </li>
                        ) }
                        { user?.profile?.birthdate && (
                            <li className="text-gray-600 inline-block mr-3">
                                <HiOutlineCake className="inline-block text-lg"/>&nbsp;
                                Born { new Date( user?.profile?.birthdate ).toLocaleDateString( 'en-us', {
                                day: "numeric",
                                year: "numeric",
                                month: "short"
                            } ) }
                            </li>
                        ) }
                        <li className="text-gray-600 inline-block mr-3">
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
                            <strong>{ user?.followingsCount }</strong> Following
                        </li>
                        <li className="text-gray-600 inline-block mr-3">
                            <strong>{ user?.followersCount }</strong> Followers
                        </li>
                    </ul>
                </div>


                <TabLinkList links={ tabLinks }/>
            </div>

            { children }

        </div>
    )
}
