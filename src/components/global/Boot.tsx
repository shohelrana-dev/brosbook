import { useEffect } from 'react'
import { io } from "socket.io-client"
import useUnauthorizedAlert from "@hooks/useUnauthorzedAlert"
import { usePathname } from "next/navigation"
import useAuthState from "@hooks/useAuthState"
import { useDispatch } from "react-redux"
import { authChecked } from "@slices/authSlice"

export default function Boot(){
    const { user, isAuthenticated, isChecked } = useAuthState()
    const unauthorizedAlert                    = useUnauthorizedAlert()
    const pathname                             = usePathname()
    const dispatch                             = useDispatch()

    useEffect( () => {
        const localAuth = localStorage.getItem( 'auth' )
        if( ! localAuth && ! isChecked ){
            dispatch( authChecked() )
        }
    }, [isChecked, user] )

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
    }, [isAuthenticated, isChecked, pathname] )

    return null
}