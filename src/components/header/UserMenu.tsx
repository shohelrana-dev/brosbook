import Link from 'next/link'
import { FaSignOutAlt as LogoutIcon } from 'react-icons/fa'
import { RiUserSettingsFill as SettingIcon } from 'react-icons/ri'
import { useConfirmAlert } from 'react-use-confirm-alert'
import Avatar from '~/components/ui/Avatar'
import Tooltip from '~/components/ui/Tooltip'
import useAuth from '~/hooks/useAuth'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '~/lib/nextui'
import { useLazyLogoutQuery } from '~/services/authApi'
import siteMetadata from '~/utils/siteMetadata'

export default function UserMenu() {
    const { user } = useAuth()
    const confirmAlert = useConfirmAlert()
    const [logout] = useLazyLogoutQuery()

    async function handleLogout() {
        confirmAlert({
            title: `Log out of ${siteMetadata.appName}?`,
            message: 'You can always log back in at any time. And you can switch another account.',
            confirmButtonLabel: 'Log out',
            onConfirm: logout as any,
        })
    }

    return (
        <Dropdown
            placement='bottom-end'
            classNames={{
                base: 'before:bg-default-200', // change arrow background
                content:
                    'bg-transparent backdrop-blur-sm py-1 px-1 border border-default-200 bg-gradient-to-br from-white/60 to-default-200',
            }}
        >
            <Tooltip content='Profile'>
                <DropdownTrigger>
                    <div className='rounded-full ml-2 cursor-pointer'>
                        <Avatar
                            src={user?.avatar?.url}
                            size='small'
                            className='border-2 border-primary'
                        />
                    </div>
                </DropdownTrigger>
            </Tooltip>

            <DropdownMenu variant='faded' aria-label='Profile menu'>
                <DropdownItem
                    key='profile'
                    as={Link}
                    href={`/${user?.username}`}
                    startContent={<Avatar src={user?.avatar?.url} size='medium' />}
                    showDivider
                    title={
                        <div className='ml-1'>
                            <p>{user?.fullName}</p>
                            <p className='text-xs text-left text-gray-700'>Your profile</p>
                        </div>
                    }
                />

                <DropdownItem
                    key='settings'
                    as={Link}
                    href='/account'
                    startContent={<SettingIcon size={20} />}
                    title='Settings'
                />

                <DropdownItem
                    key='logout'
                    onClick={handleLogout}
                    color='danger'
                    startContent={<LogoutIcon size={20} />}
                    title='Logout'
                />
            </DropdownMenu>
        </Dropdown>
    )
}
