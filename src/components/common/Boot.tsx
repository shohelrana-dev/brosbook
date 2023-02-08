import React, { useEffect } from 'react'
import { useDispatch } from "react-redux"
import { useGetCurrentUserQuery } from "@services/usersApi"
import { setAuth } from "@slices/authSlice"
import { io } from "socket.io-client"

export default function Boot(){
    const dispatch       = useDispatch()
    const { data: user } = useGetCurrentUserQuery()

    useEffect( () => {
        if( user && Object.keys( user! ).length > 0 ){
            dispatch( setAuth( user! ) )
        }
    }, [user] )

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