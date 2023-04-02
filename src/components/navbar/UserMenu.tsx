import React from 'react'
import { Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react"
import Avatar from "@components/global/Avatar"
import Link from "next/link"
import { RiUserSettingsFill as SettingIcon } from "react-icons/ri"
import { FaSignOutAlt as LogoutIcon } from "react-icons/fa"
import useAuthState from "@hooks/useAuthState"
import { useRouter } from "next/navigation"
import { useConfirmAlert } from "react-use-confirm-alert"
import { removeCookie } from "tiny-cookie";
import { userLoggedOut } from "@slices/authSlice"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"

export default function UserMenu(){
    const { user }     = useAuthState()
    const router       = useRouter()
    const dispatch     = useDispatch()
    const confirmAlert = useConfirmAlert()

    async function handleLogout(){
        await confirmAlert( {
            title: `Log out of ${ process.env.NEXT_PUBLIC_APP_NAME }?`,
            message: 'You can always log back in at any time. And you can switch another account.',
            confirmButtonLabel: 'Log out',
            onConfirm: async() => {
                removeCookie( 'access_token' )
                dispatch( userLoggedOut() )
                toast.success( 'Logged out.' )

                await router.replace( '/auth/login' )
            }
        } )
    }

    return (
        <Menu>
            <MenuHandler>
                <button className="rounded-full ml-2">
                    <Avatar src={ user?.avatar?.url } size="small"/>
                </button>
            </MenuHandler>
            <MenuList className="font-[inherit]">
                <MenuItem className="py-0 mb-2">
                    <Link href={ `/${ user?.username }` }
                          className="flex py-2 gap-2 border-b-2 border-gray-50">
                        <Avatar src={ user?.avatar?.url } size="small"/>
                        <div>
                            <p>{ user?.fullName }</p>
                            <p className="text-xs">Your profile</p>
                        </div>
                    </Link>
                </MenuItem>
                <MenuItem className="py-0">
                    <Link href="/account" className="block py-2">
                        <SettingIcon className="inline-block mr-2" size={ 20 }/>
                        Settings
                    </Link>
                </MenuItem>
                <MenuItem onClick={ handleLogout }>
                    <LogoutIcon className="inline-block mr-2" size={ 20 }/>
                    Logout
                </MenuItem>
            </MenuList>
        </Menu>
    )
}