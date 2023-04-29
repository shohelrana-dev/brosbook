"use client"
import { useEffect, useRef } from 'react'
import { io } from "socket.io-client"
import useUnauthorizedAlert from "@hooks/useUnauthorzedAlert"
import { usePathname } from "next/navigation"
import useAuthState from "@hooks/useAuthState"
import { userLoggedIn, userLoggedOut } from "@slices/authSlice"
import { User } from "@interfaces/user.interfaces"
import { useDispatch } from "react-redux"
import {removeCookie} from "tiny-cookie"

export default function PreLoader( { user: preLoadedUser }: { user: User } ){
    const loaded                               = useRef( false )
    const { user, isAuthenticated, isChecked } = useAuthState()
    const unauthorizedAlert                    = useUnauthorizedAlert()
    const pathname                             = usePathname()
    const dispatch                             = useDispatch()

    if( ! loaded.current && preLoadedUser ){
        dispatch( userLoggedIn( preLoadedUser ) )
        loaded.current = true
    } else if( ! loaded.current ){
        setTimeout(() => {
            removeCookie('access_token')
        }, 2000)
        dispatch( userLoggedOut() )
        loaded.current = true
    }

    useEffect( () => {
        if( ! user?.id ) return

        const socket = io( process.env.NEXT_PUBLIC_SERVER_BASE_URL! )

        if( user && Object.keys( user ).length > 0 ){
            socket.on( 'connect', () => {
                socket.emit( 'connect_user', user )
            } )
        }

        if( socket ) return () => {
            socket.close()
        }
    }, [user] )


    useEffect( () => {
        if( isChecked && ! isAuthenticated && ! pathname?.startsWith( '/auth/' ) ){
            setTimeout( () => {
                unauthorizedAlert( {
                    title: `New to ${ process.env.NEXT_PUBLIC_APP_NAME }?`,
                    message: 'Sign up now to get your own personalized timeline!'
                } )
            }, 3000 )
        }
    }, [isAuthenticated, pathname] )

    return null
}