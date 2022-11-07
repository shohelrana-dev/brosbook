import React, { ReactNode} from 'react'
import Link from "next/link"
import Image from "next/image"
import {GoLocation} from "react-icons/go"
import {HiOutlineCake} from "react-icons/hi"
import {MdOutlineSchedule} from "react-icons/md"

import FollowButton from "@components/common/FollowButton"
import placeholderCoverPhoto from "@images/placeholder-cover-photo.png"
import {http} from "@boot/axios"
import {cookies} from "next/headers"
import {User} from "@interfaces/user.interfaces"
import LightboxImage from "@components/common/LightboxImage"
import TabLinkList from "@components/common/TabLinkList"

interface ProfileLayoutProps {
    children: ReactNode
    params: {username: string}
}

export default async function ProfileLayout({ children, params }: ProfileLayoutProps) {
    const config = {
        headers: { Authorization: `Bearer ${cookies().get('access_token')?.value}` }
    }

    const currentUser: User = ( await http.get(`/users/me`, config)).data
    const user: User = ( await http.get(`/users/${params.username}`, config)).data

    const tabLinks = [
        {title: "Posts", link: `/${user?.username}`},
        {title: "Followers", link: `/${user?.username}/followers`},
        {title: "Following", link: `/${user?.username}/following`},
        {title: "Media", link: `/${user?.username}/media`}
    ]

    return (
        <div>
            <div className="bg-white pb-5">
                <div>
                    <div>
                        {user?.profile?.coverPhoto ? (
                                    <LightboxImage
                                        src={user?.profile?.coverPhoto}
                                        width={800}
                                        height={400}
                                        alt="cover photo"
                                    />) : (
                            <Image src={placeholderCoverPhoto} width={800} height={400} alt='cover photo' />
                        )}
                    </div>
                    <div className="p-4 flex justify-between">
                        <LightboxImage src={user?.photo} className="rounded-full !border-white !border-6 !border-solid mt-[-100px]" alt="User profile photo" width={150} height={150}/>

                        {currentUser && currentUser?.username !== user?.username && (
                            <div>
                                <FollowButton user={user!} />
                            </div>
                        )}
                        {currentUser && currentUser?.username === user?.username && (
                            <div>
                                <Link href="/account/profile" className="button-bordered rounded-full py-2 px-5 mt-3 mr-4">
                                    Edit Profile
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6">
                    <div>
                        <h2 className="text-xl font-bold">{user?.fullName}</h2>
                        <p className="text-gray-600 mb-2">@{user?.username}</p>
                        <div>{user?.profile?.bio}</div>
                    </div>
                    <ul className="mt-4">
                        {user?.profile?.location && (
                            <li className="text-gray-600 inline-block mr-3">
                                <GoLocation className="inline-block text-lg" />&nbsp;
                                {user?.profile?.location}
                            </li>
                        )}
                        {user?.profile?.birthdate && (
                            <li className="text-gray-600 inline-block mr-3">
                                <HiOutlineCake className="inline-block text-lg" />&nbsp;
                                Born {new Date(user?.profile?.birthdate).toLocaleDateString('en-us', {
                                day: "numeric",
                                year: "numeric",
                                month: "short"
                            })}
                            </li>
                        )}
                        <li className="text-gray-600 inline-block mr-3">
                            <MdOutlineSchedule className="inline-block text-lg"/>&nbsp;
                            Joined {new Date(user?.createdAt!).toLocaleDateString('en-us', {
                            day: "numeric",
                            year: "numeric",
                            month: "short"
                        })}
                        </li>
                    </ul>
                    <ul className="mt-4">
                        <li className="text-gray-600 inline-block mr-3">
                            <span className="font-bold">{user?.followingCount}</span> Following
                        </li>
                        <li className="text-gray-600 inline-block mr-3">
                            <span className="font-bold">{user?.followerCount}</span> Followers
                        </li>
                    </ul>
                </div>


                <TabLinkList links={tabLinks}/>
            </div>

            {children}

        </div>
    )
}
