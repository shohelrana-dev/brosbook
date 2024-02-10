import { Card, CardBody, CardFooter, CardHeader, Popover, PopoverContent } from '@nextui-org/react'
import Link from 'next/link'
import { RefObject, useEffect, useState } from 'react'
import { TbDiscountCheckFilled as BlueBadgeIcon } from 'react-icons/tb'
import TextOverflow from 'react-text-overflow'
import Avatar from '~/components/ui/Avatar'
import FollowButton from '~/components/ui/FollowButton'
import { User } from '~/interfaces/user.interfaces'
import { useGetFollowersCountQuery, useGetFollowingsCountQuery } from '~/services/usersApi'

interface Props {
   user: User
   triggerRef: RefObject<HTMLElement>
}

export default function UserPopupCard({ user, triggerRef }: Props) {
   const { data: { count: followersCount } = {} } = useGetFollowersCountQuery(user.id)
   const { data: { count: followingsCount } = {} } = useGetFollowingsCountQuery(user.id)
   const [isOpen, setIsOpen] = useState(false)
   const [isHovered, setIsHovered] = useState(false)

   const triggerEl = triggerRef.current

   useEffect(() => {
      const timer = setTimeout(() => isHovered && setIsOpen(true), 700)

      return () => clearTimeout(timer)
   }, [isHovered])

   useEffect(() => {
      const timer = setTimeout(() => !isHovered && setIsOpen(false), 400)

      return () => clearTimeout(timer)
   }, [isHovered])

   useEffect(() => {
      const handleMouseEnter = () => !isHovered && setIsHovered(true)

      const handleMouseLeave = () => isHovered && setIsHovered(false)

      triggerEl?.addEventListener('mouseenter', handleMouseEnter)
      triggerEl?.addEventListener('mouseleave', handleMouseLeave)

      return () => {
         triggerEl?.removeEventListener('mouseenter', handleMouseEnter)
         triggerEl?.removeEventListener('mouseleave', handleMouseLeave)
      }
   }, [isHovered, triggerEl])

   const { fullName, username, avatar, profile } = user

   const renderFollowCount = (label: string, count: number) => (
      <div className="flex gap-1">
         <p className="font-semibold text-default-600 text-small">{count}</p>
         <p className="text-default-500 text-small">{label}</p>
      </div>
   )

   return (
      <Popover
         showArrow
         placement="bottom"
         isOpen={isOpen}
         triggerRef={triggerRef}
         onOpenChange={setIsOpen}
      >
         <></>

         <PopoverContent
            className="p-1"
            onMouseEnter={() => {
               setIsHovered(true)
               setIsOpen(true)
            }}
            onMouseLeave={() => setIsHovered(false)}
         >
            <Card shadow="none" className="max-w-[300px] border-none bg-transparent">
               <CardHeader className="justify-between gap-14">
                  <Avatar src={avatar.url} size="large" />

                  <FollowButton user={user} size="md" />
               </CardHeader>

               <CardBody className="px-3 py-0">
                  <Link href={`/${username}`} className="flex flex-col items-start justify-center">
                     <h4 className="text-lg font-semibold leading-none text-default-600 flex">
                        <TextOverflow text={fullName} />
                        <BlueBadgeIcon color="rgb(58,141,245)" size={16} className="ml-[1px]" />
                     </h4>
                     <h5 className="text-small tracking-tight text-default-500">@{username}</h5>
                  </Link>

                  {!!profile?.bio && (
                     <p className="text-small pl-px text-default-500">
                        {profile.bio}
                        <span aria-label="confetti" role="img">
                           🎉
                        </span>
                     </p>
                  )}
               </CardBody>

               <CardFooter className="gap-3">
                  {renderFollowCount('Following', followingsCount!)}
                  {renderFollowCount('Followers', followersCount!)}
               </CardFooter>
            </Card>
         </PopoverContent>
      </Popover>
   )
}
