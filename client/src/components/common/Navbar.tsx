"use client"
import React from 'react'
import Link from "next/link"
import {CgProfile as ProfileIcon} from "react-icons/cg"
import {HiMail as MessageIcon} from "react-icons/hi"
import {RiUserSettingsFill as SettingIcon} from "react-icons/ri"
import {FaSignOutAlt as LogoutIcon} from "react-icons/fa"
import Avatar from "@components/common/Avatar"
import {
    Navbar as BaseNavbar,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem
} from "@material-tailwind/react"
import useCurrentUser from "@hooks/useCurrentUser"
import {motion} from "framer-motion"
import IconButton from "@components/common/IconButton"

function NavBar() {
    const {user, isAuthenticated} = useCurrentUser()

    if (!isAuthenticated) return null


    return (
        <motion.header
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <BaseNavbar fullWidth className="mx-auto py-2 px-4 lg:px-8 lg:py-4">
                <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
                    <div>
                        <Link href="/">
                            <h3 className="font-bold text-lg">{process.env.NEXT_PUBLIC_APP_NAME || 'Brosbook'}</h3>
                        </Link>
                    </div>

                    <div className="flex">
                        <div className="mr-3">
                            <Link href="/messages" className="block">
                                <IconButton className="p-6">
                                    <MessageIcon size={30}/>
                                </IconButton>
                            </Link>
                        </div>
                        <Menu>
                            <MenuHandler>
                                <button className="rounded-full">
                                    <Avatar src={user?.avatar.url}/>
                                </button>
                            </MenuHandler>
                            <MenuList>
                                <MenuItem>
                                    <Link href={`/${user?.username}`} className="block">
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
                </div>
            </BaseNavbar>
        </motion.header>
    )
}

export default NavBar