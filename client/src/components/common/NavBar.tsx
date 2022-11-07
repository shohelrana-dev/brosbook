"use client"
import React               from 'react'
import useAuth from "@hooks/useAuth"
import {Avatar} from "@mui/material"
import Link from "next/link"
import {CgProfile as ProfileIcon} from "react-icons/cg"
import {HiMail as MessageIcon} from "react-icons/hi"
import {RiUserSettingsFill as SettingIcon} from "react-icons/ri"
import {FaSignOutAlt as LogoutIcon} from "react-icons/fa"

function NavBar(){
    const { user, isAuthenticated }                   = useAuth()

    if(! isAuthenticated ) return null


    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost normal-case text-xl">{process.env.NEXT_PUBLIC_APP_NAME || 'BrosBook'}</Link>
            </div>
            <div className="flex-none">
                <div className="dropdown dropdown-end">
                    <Link href="/messages" className="btn btn-ghost btn-circle">
                        <MessageIcon size={30}/>
                    </Link>
                </div>
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                        <Avatar src={user.photo}/>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                            <Link href={`/${user.username}`}>
                                <ProfileIcon size={20}/>
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link href="/account">
                                <SettingIcon size={20}/>
                                Settings
                            </Link>
                        </li>
                        <li>
                            <Link href="/auth/logout">
                                <LogoutIcon size={20}/>
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NavBar