"use client"
import Link from "next/link"
import ExpandableSearch from "@components/navbar/ExpandableSearch"
import NotificationsNavLink from "@components/navbar/NotificationsNavLink"
import MessagesNavLink from "@components/navbar/MessagesNavLink"
import UserMenu from "@components/navbar/UserMenu"
import useAuthState from "@hooks/useAuthState"
import Image from "next/image"
import logo from "@assets/images/logo.png"
import {Button, AppBar, IconButton, Box} from "@mui/material"
import tw from "twin.macro"
import {Container} from "@components/styles/Global.styles"

const StyledContainer = tw(Container)`mx-auto flex items-center justify-between text-blue-gray-900`

export default function Navbar() {
    const {isAuthenticated} = useAuthState()

    return (
        <AppBar id="appNavbar" variant="outlined" color="default" position="static" sx={{background: "#fff", padding: '6px 0'}}>
            <StyledContainer>
                <Link href="/">
                    <IconButton>
                        <Image src={logo} alt={'Brosbook logo'} width={31} height={40}/>
                    </IconButton>
                </Link>
                <Box sx={{flexGrow: 1}}/>
                <Box sx={{display: 'flex'}}>
                    <ExpandableSearch/>
                    {isAuthenticated ? (
                        <>
                            <NotificationsNavLink/>
                            <MessagesNavLink/>
                            <UserMenu/>
                        </>
                    ) : (
                        <>
                            &nbsp;
                            <Link href="/auth/login">
                                <Button variant="contained">Login</Button>
                            </Link>
                        </>
                    )}
                </Box>
            </StyledContainer>
        </AppBar>
    )

}