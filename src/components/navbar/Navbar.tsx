"use client"
import Link from "next/link"
import ExpandableSearch from "@components/navbar/ExpandableSearch"
import NotificationsNavLink from "@components/navbar/NotificationsNavLink"
import MessagesNavLink from "@components/navbar/MessagesNavLink"
import UserMenu from "@components/navbar/UserMenu"
import useAuthState from "@hooks/useAuthState"
import Image from "next/image"
import logo from "@assets/images/logo.png"
import titledLogo from "@assets/images/titled-logo.png"
import { Button, AppBar, IconButton, Box } from "@mui/material"
import useMediaQuery from "@hooks/useMediaQuery"
import { usePathname } from "next/navigation"
import { setNavbarHeight } from "@slices/navbarHeightSlice"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import isServer from "@utils/isServer"

export default function Navbar() {
    const isScreenSmall       = useMediaQuery('(max-width: 767px)')
    const isScreenLarge       = useMediaQuery('(min-width: 920px)')
    const { isAuthenticated } = useAuthState()
    const pathname            = usePathname()
    const disptach            = useDispatch()

    useEffect(() => {
        if ( !isServer ) {
            const navbarEl = document.getElementById('appNavbar')
            disptach( setNavbarHeight( `${isScreenLarge ? navbarEl?.clientHeight : navbarEl?.clientHeight! + 12}px` ) )
            
        }
    }, [isScreenLarge])

    return (
        <AppBar id="appNavbar" variant="outlined" color="default" position="static" sx={ { background: "#fff", padding: '6px 10px' } }>
            <div className="container flex flex-wrap items-center justify-between text-gray-900">
                <Link href="/">
                    { isScreenSmall ? (
                        <IconButton>
                            <Image src={ logo } alt={ 'Brosbook logo' } width={ 31 } height={ 40 }/>
                        </IconButton>
                    ) : (
                        <Image src={ titledLogo } alt={ 'Brosbook logo' } width={ 150 } height={ 40 }/>
                    ) }
                </Link>
                <Box sx={ { display: 'flex', flexGrow: 1 } }/>
                <Box sx={ { display: 'flex', flexWrap: 'wrap', alignItems: 'center' } }>
                    <ExpandableSearch/>
                    { isAuthenticated ? (
                        <>
                            <NotificationsNavLink/>
                            <MessagesNavLink/>
                            <UserMenu/>
                        </>
                    ) : (
                        <>
                            &nbsp;
                            <Link href={ `/auth/login${pathname.startsWith('/auth') ? '' : '?redirect_to=' + pathname}` }>
                                <Button variant="contained">Login</Button>
                            </Link>
                        </>
                    ) }
                </Box>
            </div>
        </AppBar>
    )
}