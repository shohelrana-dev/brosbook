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
import tw from "twin.macro"
import { Container } from "@components/styles/Global.styles"
import useMediaQuery from "@hooks/useMediaQuery";

const StyledContainer = tw(Container)`mx-auto flex items-center justify-between text-blue-gray-900`

export default function Navbar() {
    const isSmallDevice       = useMediaQuery('(max-width: 767px)')
    const { isAuthenticated } = useAuthState()

    return (
        <AppBar id="appNavbar" variant="outlined" color="default" position="static"
                sx={ { background: "#fff", padding: '6px 10px' } }>
            <StyledContainer>
                <Link href="/">
                    { isSmallDevice ? (
                        <IconButton>
                            <Image src={ logo } alt={ 'Brosbook logo' } width={ 31 } height={ 40 }/>
                        </IconButton>
                    ) : (
                        <Image src={ titledLogo } alt={ 'Brosbook logo' } width={ 150 } height={ 40 }/>
                    ) }
                </Link>
                <Box sx={ { flexGrow: 1 } }/>
                <Box sx={ { display: 'flex' } }>
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
                            <Link href="/auth/login">
                                <Button variant="contained">Login</Button>
                            </Link>
                        </>
                    ) }
                </Box>
            </StyledContainer>
        </AppBar>
    )

}