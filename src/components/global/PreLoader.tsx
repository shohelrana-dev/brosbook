"use client"
import { useEffect, useRef } from 'react'
import useUnauthorizedAlert from "@hooks/useUnauthorzedAlert"
import { usePathname } from "next/navigation"
import useAuthState from "@hooks/useAuthState"
import { userLoggedIn, userLoggedOut } from "@slices/authSlice"
import { User } from "@interfaces/user.interfaces"
import { useDispatch } from "react-redux"
import { removeCookie } from "tiny-cookie"
import { initSocket } from "@utils/socket"

export default function PreLoader( { user: preLoadedUser }: { user: User } ) {
    const loaded                               = useRef( false )
    const showedPopup                          = useRef( false )
    const { user, isAuthenticated, isChecked } = useAuthState()
    const unauthorizedAlert                    = useUnauthorizedAlert()
    const pathname                             = usePathname()
    const dispatch                             = useDispatch()

    if ( !loaded.current && preLoadedUser ) {
        dispatch( userLoggedIn( preLoadedUser ) )
        loaded.current = true
    } else if ( !loaded.current ) {
        if ( typeof window !== 'undefined' ) {
            removeCookie( 'access_token' )
        }
        dispatch( userLoggedOut() )
        loaded.current = true
    }

    useEffect( () => {
        if ( !user?.id ) return

        const socket = initSocket()

        socket.on( 'connect', () => {
            console.log( 'socket io connected' )
            socket.emit( 'user.connect', user )
        } )

        if ( socket ) return () => {
            socket.close()
        }
    }, [user?.id] )


    useEffect( () => {
        if ( isChecked && !isAuthenticated && !pathname?.startsWith( '/auth/' ) ) {
            if(showedPopup.current) return
            else showedPopup.current = true

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