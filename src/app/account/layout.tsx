'use client'
import { ReactNode, useEffect } from 'react'
import { CgProfile as ProfileIcon } from 'react-icons/cg'
import { MdOutlineManageAccounts as AccountIcon } from 'react-icons/md'
import Avatar from '~/components/ui/Avatar'
import Loader from '~/components/ui/Loader'
import SidebarLayout from '~/components/ui/SidebarLayout'
import TabLinkList, { TabLink } from '~/components/ui/TabLinkList'
import useAuth from '~/hooks/useAuth'

const tabLinks: TabLink[] = [
    { label: 'Account', pathname: '/account', icon: <AccountIcon size={20} /> },
    { label: 'Profile', pathname: '/account/profile', icon: <ProfileIcon size={18} /> },
]

interface Props {
    children: ReactNode
    modal: ReactNode
}

export default function AccountLayout({ children, modal }: Props) {
    const { user, isAuthenticated } = useAuth()

    useEffect(() => {
        document.title = 'Your account'
    }, [])

    if (!isAuthenticated) return <Loader />

    return (
        <SidebarLayout>
            <div className='bg-white p-5 rounded-lg lg:rounded-none'>
                <TabLinkList links={tabLinks} />

                <div className='flex flex-wrap items-center mt-5'>
                    <div className='w-3/12 flex flex-wrap justify-end p-4'>
                        <Avatar src={user?.avatar.url} alt={user?.username} size='large' />
                    </div>
                    <div className='flex flex-wrap p-4'>
                        <h3 className='text-xl font-medium'>{user?.username}</h3>
                    </div>
                </div>

                {children}

                {modal}
            </div>
        </SidebarLayout>
    )
}
