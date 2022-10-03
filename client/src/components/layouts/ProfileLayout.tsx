import React, { ReactNode }       from 'react'
import Link                       from "next/link"
import { SRLWrapper }             from "simple-react-lightbox"
import Image                      from "next/image"
import { useRouter }              from "next/router"
import LocationIcon               from "@mui/icons-material/LocationOnOutlined"
import CakeIcon                   from "@mui/icons-material/CakeOutlined"
import ScheduleIcon               from "@mui/icons-material/Schedule"
import { Button, LinearProgress } from "@mui/material"
import moment                     from "moment"

import MainLayout          from "@components/layouts/MainLayout"
import { User }            from "@interfaces/user.interfaces"
import { useGetOneUserQuery } from "@services/usersApi"
import { useSelector }     from "react-redux"
import { selectAuthState } from "@features/authSlice"

interface ProfileLayoutProps {
    children: ReactNode
}

export default function ProfileLayout( { children }: ProfileLayoutProps ){
    //hooks
    const router                                 = useRouter()
    const { isLoading, data: user }              = useGetOneUserQuery( router.query.username as string )
    const { isAuthenticated, user: currentUser } = useSelector( selectAuthState )

    async function handleFollowClick( user: User ){

    }

    if( isLoading ) return <LinearProgress/>

    return (
        <MainLayout>
            <div className="container">
                <div className="bg-white pb-5">
                    {/*Profile photos*/ }
                    <div>
                        <div>
                            { user?.profile?.coverPhoto ? (
                                <SRLWrapper>
                                    <a href="http://localhost:4000/images/cover.jpg">
                                        <Image
                                            src={ user?.profile?.coverPhoto }
                                            width={ 800 }
                                            height={ 400 }
                                            objectFit="cover"
                                        />
                                    </a>
                                </SRLWrapper> ) : (
                                <Image src="/images/placeholder-cover-photo.png" width={ 800 } height={ 400 }
                                       objectFit="cover"/>
                            ) }
                        </div>
                        <div className="flex justify-between">
                            <SRLWrapper>
                                <a
                                    href="http://localhost:4000/images/cover.jpg"
                                    className="inline-block ml-6 mt-[-90px] rounded-full">
                                    { user?.photo && <Image
                                        src={ user?.photo } width={ 160 }
                                        height={ 160 }
                                        objectFit="cover"
                                        className="rounded-full !border-white !border-6 !border-solid"
                                    /> }
                                </a>
                            </SRLWrapper>
                            { isAuthenticated && currentUser.username !== user?.username && (
                                < div>
                                    <button onClick={ () => handleFollowClick( user! ) }
                                            className="button-blue rounded-full py-2 px-5 mt-3 mr-4">
                                        Follow
                                    </button>
                                </div>
                            ) }
                            { isAuthenticated && currentUser.username === user?.username && (
                                < div>
                                    <Link href="/settings/edit_profile">
                                        <a className="button-blue rounded-full py-2 px-5 mt-3 mr-4">
                                            Edit Profile
                                        </a>
                                    </Link>
                                </div>
                            ) }
                        </div>
                    </div>

                    {/*Profile Information*/ }
                    <div className="px-6">
                        <div>
                            <h2 className="text-xl font-bold">{ user?.fullName }</h2>
                            <p className="text-gray-600 mb-2">@{ user?.username }</p>
                            <div>{ user?.profile?.bio }</div>
                        </div>
                        <ul className="mt-4">
                            { user?.profile?.location && (
                                <li className="text-gray-600 inline-block mr-3">
                                    <LocationIcon/>&nbsp;
                                    { user?.profile?.location }
                                </li>
                            ) }
                            { user?.profile?.birthdate && (
                                <li className="text-gray-600 inline-block mr-3">
                                    <CakeIcon/>&nbsp;
                                    Born { moment( user?.profile?.birthdate ).format( 'MMMM DD, YYYY' ) }
                                </li>
                            ) }
                            <li className="text-gray-600 inline-block mr-3">
                                <ScheduleIcon/>&nbsp;
                                Joined { moment( user?.createdAt ).format( 'MMMM YYYY' ) }
                            </li>
                        </ul>
                        <ul className="mt-4">
                            <li className="text-gray-600 inline-block mr-3">
                                <span className="font-bold">{ user?.followingCount }</span> Following
                            </li>
                            <li className="text-gray-600 inline-block mr-3">
                                <span className="font-bold">{ user?.followerCount }</span> Followers
                            </li>
                        </ul>
                    </div>


                    <div className="px-6 mt-5">
                        <Link href={ `/${ router.query.username }` }>
                            <a className="inline-block mr-3">
                                <Button variant="outlined" size="small">
                                    Posts
                                </Button>
                            </a>
                        </Link>
                        <Link href={ `/${ router.query.username }/followers` }>
                            <a className="inline-block mr-3">
                                <Button variant="outlined" size="small">
                                    Followers
                                </Button>
                            </a>
                        </Link>
                        <Link href={ `/${ router.query.username }/following` }>
                            <a className="inline-block mr-3">
                                <Button variant="outlined" size="small">
                                    Following
                                </Button>
                            </a>
                        </Link>
                        <Link href={ `/${ router.query.username }/photos` }>
                            <a className="inline-block mr-3">
                                <Button variant="outlined" size="small">
                                    Photos
                                </Button>
                            </a>
                        </Link>
                    </div>
                </div>

                { children }

            </div>
        </MainLayout>
    )
}
