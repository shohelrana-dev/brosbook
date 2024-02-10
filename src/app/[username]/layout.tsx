import { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
import { GoLocation } from 'react-icons/go'
import { HiOutlineCake } from 'react-icons/hi'
import { IoMailOutline as MessageIcon } from 'react-icons/io5'
import { MdOutlineSchedule } from 'react-icons/md'
import { TbDiscountCheckFilled as BlueBadgeIcon } from 'react-icons/tb'
import CoverPhoto from '~/components/profile/CoverPhoto'
import ExtraOptions from '~/components/profile/ExtraOptions'
import ProfilePhoto from '~/components/profile/ProfilePhoto'
import Button from '~/components/ui/Button'
import FollowButton from '~/components/ui/FollowButton'
import IconButton from '~/components/ui/IconButton'
import SidebarLayout from '~/components/ui/SidebarLayout'
import TabLinkList from '~/components/ui/TabLinkList'
import Tooltip from '~/components/ui/Tooltip'
import {
	getCurrentUser,
	getFollowersCount,
	getFollowingsCount,
	getUserByUsername,
} from '~/services/index'

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
   const user = await getUserByUsername(params.username, cookies())

   if (!user)
      return {
         title: 'User not found',
      }

   const title = `${user?.fullName} (@${user?.username})`
   const description = user?.profile?.bio
   const image = user?.avatar.url
   const url = `${process.env.NEXT_PUBLIC_APP_URL}/${user?.username}`

   return {
      title,
      description,
      keywords: [
         user.fullName,
         user.username,
         'posts',
         'profile',
         'interests',
         'contact',
         process.env.NEXT_PUBLIC_APP_NAME!,
      ],
      openGraph: {
         type: 'profile',
         url: url,
         title: title,
         description: description!,
         images: image!,
      },
      twitter: {
         title: title,
         description: description!,
         images: image!,
      },
      other: {
         'og:image:alt': user.fullName,
         'profile:first_name': user.firstName,
         'profile:last_name': user.lastName,
         'profile:username': user.username,
         'profile:email': user.email,
         'profile:phone_number': user.profile?.phone!,
      },
   }
}

interface Props {
   children: ReactNode
   params: {
      username: string
   }
}

export const revalidate = 0

export default async function ProfileLayout({ children, params }: Props) {
   const nextCookies = cookies()

   const user = await getUserByUsername(params.username, nextCookies)

   if (!user) return notFound()

   const [currentUser, followersCount, followingsCount] = await Promise.all([
      getCurrentUser(nextCookies),
      getFollowersCount(user.id),
      getFollowingsCount(user.id),
   ])

   const tabLinks = [
      { label: 'Posts', pathname: `/${user?.username}` },
      { label: 'Followers', pathname: `/${user?.username}/followers` },
      { label: 'Following', pathname: `/${user?.username}/following` },
      { label: 'Media', pathname: `/${user?.username}/media` },
   ]

   const isAuthenticated = !!currentUser?.id
   const isAuthAndSameUser = isAuthenticated && currentUser?.username === user?.username

   return (
      <SidebarLayout>
         <div>
            <div className="bg-white pb-5 mb-3">
               <div>
                  <CoverPhoto user={user} />
                  <div className="p-4 flex flex-wrap justify-between relative">
                     <ProfilePhoto user={user} />

                     <div className="flex flex-wrap items-center gap-2">
                        <ExtraOptions user={user} />
                        {isAuthenticated && !isAuthAndSameUser && (
                           <>
                              <Tooltip content="Messages" disableWrapper>
                                 <IconButton as={Link} href={`/messages/${user.username}`}>
                                    <MessageIcon size={20} />
                                 </IconButton>
                              </Tooltip>
                              <FollowButton user={user!} size="md" />
                           </>
                        )}
                        {isAuthAndSameUser && (
                           <Button as={Link} href="/account/profile" variant="bordered">
                              Edit Profile
                           </Button>
                        )}
                     </div>
                  </div>
               </div>

               <div className="px-3 sm:px-6 mb-6">
                  <div>
                     <div className="flex flex-wrap items-center">
                        <h2 className="text:lg md:text-xl font-bold">{user?.fullName}</h2>
                        <BlueBadgeIcon
                           color="rgb(58,141,245)"
                           size={20}
                           className="ml-[1px] mt-[2px]"
                        />
                     </div>
                     <p className="text-gray-600 mb-2">@{user?.username}</p>
                     <div>{user?.profile?.bio}</div>
                  </div>
                  <ul className="mt-3 flex flex-wrap">
                     {user?.profile?.location && (
                        <li className="flex flex-wrap items-center text-gray-600 mr-3 mb-2">
                           <GoLocation className="inline-block text-lg" />
                           &nbsp;
                           {user?.profile?.location}
                        </li>
                     )}
                     {user?.profile?.birthdate && (
                        <li className="flex flex-wrap items-center text-gray-600 mr-3 mb-2">
                           <HiOutlineCake className="inline-block text-lg" />
                           &nbsp; Born{' '}
                           {new Date(user?.profile?.birthdate).toLocaleDateString('en-us', {
                              day: 'numeric',
                              year: 'numeric',
                              month: 'short',
                           })}
                        </li>
                     )}
                     <li className="flex flex-wrap items-center text-gray-600 mr-3 mb-2">
                        <MdOutlineSchedule className="inline-block text-lg" />
                        &nbsp; Joined{' '}
                        {new Date(user?.createdAt!).toLocaleDateString('en-us', {
                           day: 'numeric',
                           year: 'numeric',
                           month: 'short',
                        })}
                     </li>
                  </ul>
                  <ul className="mt-3">
                     <li className="text-gray-600 inline-block mr-3">
                        <Link href={`/${user.username}/following`}>
                           <strong className="text-gray-900 text-[16px]">
                              {followingsCount?.count}
                           </strong>{' '}
                           Following
                        </Link>
                     </li>
                     <li className="text-gray-600 inline-block mr-3">
                        <Link href={`/${user.username}/followers`}>
                           <strong className="text-gray-900 text-[16px]">
                              {followersCount?.count}
                           </strong>{' '}
                           Followers
                        </Link>
                     </li>
                  </ul>
               </div>

               <TabLinkList links={tabLinks} />
            </div>

            {children}
         </div>
      </SidebarLayout>
   )
}
