import React, { useEffect } from 'react'
import { useGetCurrentUserQuery } from "@services/usersApi"
import { io } from "socket.io-client"

export default function Boot(){
    const { data: user } = useGetCurrentUserQuery()

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

    return null
}