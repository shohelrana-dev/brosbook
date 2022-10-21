import React               from 'react'
import Link                from 'next/link'
import AppBar              from '@mui/material/AppBar'
import Box                 from '@mui/material/Box'
import Toolbar             from '@mui/material/Toolbar'
import IconButton          from '@mui/material/IconButton'
import Typography          from '@mui/material/Typography'
import Badge               from '@mui/material/Badge'
import MenuItem            from '@mui/material/MenuItem'
import Menu                from '@mui/material/Menu'
import AccountCircle       from '@mui/icons-material/AccountCircle'
import MailIcon            from '@mui/icons-material/Mail'
import NotificationsIcon   from '@mui/icons-material/Notifications'
import MoreIcon            from '@mui/icons-material/MoreVert'
import { Container }       from "@mui/material"
import PermIdentityIcon    from '@mui/icons-material/PermIdentity'
import LogoutIcon          from '@mui/icons-material/Logout'
import SettingsIcon        from '@mui/icons-material/Settings'
import { selectAuthState } from "@features/authSlice"
import { useSelector }     from "react-redux"

function NavBar(){
    const [anchorEl, setAnchorEl]                     = React.useState<null | HTMLElement>( null )
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>( null )
    const { user, isAuthenticated }                   = useSelector( selectAuthState )

    if( ! isAuthenticated ) return null

    const isMenuOpen       = Boolean( anchorEl )
    const isMobileMenuOpen = Boolean( mobileMoreAnchorEl )

    const handleProfileMenuOpen = ( event: React.MouseEvent<HTMLElement> ) => {
        setAnchorEl( event.currentTarget )
    }

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl( null )
    }

    const handleMenuClose = () => {
        setAnchorEl( null )
        handleMobileMenuClose()
    }

    const handleMobileMenuOpen = ( event: React.MouseEvent<HTMLElement> ) => {
        setMobileMoreAnchorEl( event.currentTarget )
    }

    const menuId     = 'primary-search-account-menu'
    const renderMenu = (
        <Menu
            anchorEl={ anchorEl }
            anchorOrigin={ {
                vertical: 'top',
                horizontal: 'right',
            } }
            id={ menuId }
            keepMounted
            transformOrigin={ {
                vertical: 'top',
                horizontal: 'right',
            } }
            open={ isMenuOpen }
            onClose={ handleMenuClose }
        >
            <MenuItem onClick={ handleMenuClose }>
                <Link href={ `/${ user.username }` }>
                    <a>
                        <PermIdentityIcon fontSize="small"/>
                        &nbsp;&nbsp;Profile
                    </a>
                </Link>
            </MenuItem>
            <MenuItem onClick={ handleMenuClose }>
                <Link href="/account">
                    <a>
                        <SettingsIcon fontSize="small"/>
                        &nbsp;&nbsp;Account
                    </a>
                </Link>
            </MenuItem>
            <MenuItem onClick={ handleMenuClose }>
                <Link href="/auth/logout">
                    <a>
                        <LogoutIcon fontSize="small"/>
                        &nbsp;&nbsp;Logout
                    </a>
                </Link>
            </MenuItem>
        </Menu>
    )

    const mobileMenuId     = 'primary-search-account-menu-mobile'
    const renderMobileMenu = (
        <Menu
            anchorEl={ mobileMoreAnchorEl }
            anchorOrigin={ {
                vertical: 'top',
                horizontal: 'right',
            } }
            id={ mobileMenuId }
            keepMounted
            transformOrigin={ {
                vertical: 'top',
                horizontal: 'right',
            } }
            open={ isMobileMenuOpen }
            onClose={ handleMobileMenuClose }
        >
            <MenuItem>
                <Link href="/messages">
                    <a>
                        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={ 4 } color="error">
                                <MailIcon/>
                            </Badge>
                        </IconButton>
                        <p>Messages</p>
                    </a>
                </Link>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={ 17 } color="error">
                        <NotificationsIcon/>
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={ handleProfileMenuOpen }>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle/>
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    )

    return (
        <Box sx={ { flexGrow: 1 } }>
            <AppBar position="static" color="transparent" className="bg-white relative">
                <Container>
                    <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={ { display: { xs: 'none', sm: 'block' } } }
                        >
                            <Link href="/">
                                BrosBook
                            </Link>
                        </Typography>

                        <Box sx={ { flexGrow: 1 } }/>
                        <Box sx={ { display: { xs: 'none', md: 'flex' } } }>
                            <Link href="/messages">
                                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                                    <Badge badgeContent={ 4 } color="error">
                                        <MailIcon/>
                                    </Badge>
                                </IconButton>
                            </Link>
                            <Link href="/notifications">
                                <IconButton
                                    size="large"
                                    aria-label="show 17 new notifications"
                                    color="inherit"
                                >
                                    <Badge badgeContent={ 17 } color="error">
                                        <NotificationsIcon/>
                                    </Badge>
                                </IconButton>
                            </Link>
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={ menuId }
                                aria-haspopup="true"
                                onClick={ handleProfileMenuOpen }
                                color="inherit"
                            >
                                <AccountCircle/>
                            </IconButton>
                        </Box>
                        <Box sx={ { display: { xs: 'flex', md: 'none' } } }>
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={ mobileMenuId }
                                aria-haspopup="true"
                                onClick={ handleMobileMenuOpen }
                                color="inherit"
                            >
                                <MoreIcon/>
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            { renderMobileMenu }
            { renderMenu }
        </Box>
    )
}

export default NavBar