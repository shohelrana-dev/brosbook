import React, { ReactNode } from 'react'
import Link from "next/link"
import { GoLocation } from "react-icons/go"
import { HiOutlineCake } from "react-icons/hi"
import { MdOutlineSchedule } from "react-icons/md"

import FollowButton from "@components/global/FollowButton"
import { cookies } from "next/headers"
import TabLinkList from "@components/global/TabLinkList"
import ButtonOutline from "@components/global/ButtonOutline"
import CoverPhoto from "@components/profile/CoverPhoto"
import ProfilePhoto from "@components/profile/ProfilePhoto"
import SidebarLayout from "@components/global/SidebarLayout"
import ExtraOptions from "@components/profile/ExtraOptions"
import {
    getCurrentUser,
    getFollowersCount,
    getFollowingsCount,
    getUserByUsername
} from "@services/index"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const generateMetadata = async( { params }: Props ): Promise<Metadata> => {
    const user = await getUserByUsername( params.username, cookies() )

    if( ! user ) return {
        title: 'Not found'
    }

    const title       = `${ user?.fullName } (@${ user?.username })`
    const description = user?.profile?.bio
    const image       = user?.avatar.url
    const url         = `${ process.env.NEXT_PUBLIC_APP_URL }/${ user?.username }`

    return {
        title,
        description,
        other: {
            "og:type": 'profile',
            "og:url": url,
            "og:title": title,
            "og:description": description!,
            "og:image": image!
        }
    }
}

interface Props {
    children: ReactNode
    params: {
        username: string
    }
}

export const revalidate = 0

export default async function ProfileLayout( { children, params }: Props ){
    const nextCookies = cookies()

    const user = await getUserByUsername( params.username, nextCookies )

    if( ! user ) return notFound()

    const [currentUser, followersCount, followingsCount] = await Promise.all(
        [getCurrentUser( nextCookies ), getFollowersCount( user.id ), getFollowingsCount( user.id )]
    )

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
                        <div className="p-4 flex justify-between relative">
                            <ProfilePhoto user={ user }/>

                            <div className="flex items-center gap-2">
                                <ExtraOptions user={ user }/>
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
                    </div>

                    <div className="px-3 sm:px-6">
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
                                <Link href={ `/${ user.username }/following` }>
                                    <strong className="text-gray-900">
                                        { followingsCount?.count }
                                    </strong> Following
                                </Link>
                            </li>
                            <li className="text-gray-600 inline-block mr-3">
                                <Link href={ `/${ user.username }/followers` }>
                                    <strong className="text-gray-900">
                                        { followersCount?.count }
                                    </strong> Followers
                                </Link>
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
