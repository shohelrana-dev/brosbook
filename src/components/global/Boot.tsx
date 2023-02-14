import React, { useEffect } from 'react'
import { useGetCurrentUserQuery } from "@services/usersApi"
import { io } from "socket.io-client"
import useUnauthorizedAlert from "@hooks/useUnauthorzedAlert"

export default function Boot(){
    const { data: user, isError } = useGetCurrentUserQuery()
    const unauthorizedAlert                  = useUnauthorizedAlert()

    useEffect( () => {
        if( ! user || Object.keys( user ).length < 1 ) return

        const socket = io( process.env.NEXT_PUBLIC_SERVER_BASE_URL! )

        if( user && Object.keys( user ).length > 0 ){
            socket.on( "connect", () => {
                socket.emit( 'connect_user', user )
            } )
        }

        if( socket ) return () => {
            socket.close()
        }
    }, [user] )

    useEffect( () => {
        if( isError && ( ! user || Object.keys( user ).length < 1 ) ){
            setTimeout( () => {
                unauthorizedAlert( {
                    title: `New to ${ process.env.NEXT_PUBLIC_APP_NAME }?`,
                    message: 'Sign up now to get your own personalized timeline!'
                } )
            }, 2000 )
        }
    }, [user, isError] )

    return null
}