"use client"
import React               from 'react'
import Link from "next/link"
import {CgProfile as ProfileIcon} from "react-icons/cg"
import {HiMail as MessageIcon} from "react-icons/hi"
import {RiUserSettingsFill as SettingIcon} from "react-icons/ri"
import {FaSignOutAlt as LogoutIcon} from "react-icons/fa"
import Avatar from "@components/common/Avatar"
import {User} from "@interfaces/user.interfaces"
import {
    Button,
    Navbar as BaseNavbar,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem, Typography
} from "@material-tailwind/react"

type Props = {
    user: User
}

function NavBar({user}: Props){

    if(! user ) return null


    return (
        <BaseNavbar fullWidth className="mx-auto py-2 px-4 lg:px-8 lg:py-4">
            <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
                <Link href="/">
                    <h3 className="font-bold text-lg">{process.env.NEXT_PUBLIC_APP_NAME || 'Brosbook'}</h3>
                </Link>
                <div>
                    list
                </div>
                <Menu>
                    <MenuHandler>
                        <button className="rounded-full">
                            <Avatar src={user.photo}/>
                        </button>
                    </MenuHandler>
                    <MenuList>
                        <MenuItem>
                            <Link href={`/${user.username}`} className="block">
                                <ProfileIcon className="inline-block mr-2" size={20}/>
                                Profile
                            </Link>
                        </MenuItem>
                        <MenuItem>
                            <Link href="/account" className="block">
                                <SettingIcon className="inline-block mr-2" size={20}/>
                                Settings
                            </Link>
                        </MenuItem>
                        <MenuItem>
                            <Link href="/auth/logout" className="block">
                                <LogoutIcon className="inline-block mr-2" size={20}/>
                                Logout
                            </Link>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </BaseNavbar>
    )
}

export default NavBar