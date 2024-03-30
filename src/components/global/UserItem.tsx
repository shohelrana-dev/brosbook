import Link from 'next/link'
import { ComponentProps, useRef } from 'react'
import { TbDiscountCheckFilled as BlueBadgeIcon } from 'react-icons/tb'
import TextOverflow from 'react-text-overflow'
import Avatar from '~/components/global/Avatar'
import FollowButton from '~/components/global/FollowButton'
import UserPopupCard from '~/components/global/UserPopupCard'
import { User } from '~/interfaces/user.interfaces'
import { cn } from '~/lib/utils'

interface Props extends ComponentProps<'div'> {
    user: User
    hideFollowButton?: boolean
    disablePopupCard?: boolean
}

export default function UserItem(props: Props) {
    const triggerRef = useRef<HTMLAnchorElement>(null)

    const { user, hideFollowButton = false, disablePopupCard = false, className, ...rest } = props
    const { fullName, username, avatar } = user

    return (
        <>
            <div
                className={cn('w-full flex justify-between gap-2 mb-4 cursor-pointer', className)}
                {...rest}
            >
                <Link href={`/${username}`} className='flex gap-3' ref={triggerRef}>
                    <Avatar src={avatar.url} />

                    <div className='flex flex-col items-start justify-center'>
                        <h4 className='text-small font-semibold leading-none text-default-600 flex'>
                            <TextOverflow text={fullName} />
                            <BlueBadgeIcon color='rgb(58,141,245)' size={16} className='ml-[1px]' />
                        </h4>
                        <h5 className='text-small tracking-tight text-default-500'>@{username}</h5>
                    </div>
                </Link>

                {!hideFollowButton && (
                    <div>
                        <FollowButton user={user} />
                    </div>
                )}
            </div>

            {!disablePopupCard && <UserPopupCard user={user} triggerRef={triggerRef} />}
        </>
    )
}
