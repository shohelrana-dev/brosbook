import React, { PropsWithChildren, ReactElement, useEffect } from 'react'
import { useDispatch, useSelector }                          from "react-redux"
import { io }                                                from "socket.io-client"

import { checkAuthAction } from "@actions/authActions"
import { selectAuth }      from "@slices/authSlice"
import { LinearProgress }  from "@mui/material"

export const socket = io( process.env.NEXT_PUBLIC_SERVER_BASE_URL! )

export default function AuthCheck( { children }: PropsWithChildren<{}> ): ReactElement {
    const { user, isAuthenticated, isCheckedAuth } = useSelector( selectAuth )
    const dispatch                                 = useDispatch()

    useEffect( () => {
        dispatch( checkAuthAction() )
    }, [ dispatch ] )

    useEffect( () => {
        if ( isAuthenticated ) {
            socket.emit( 'user_connected', user.id )
        }
    }, [ isAuthenticated ] )

    if ( isCheckedAuth ) {
        return children as ReactElement
    }
    return <LinearProgress/>

}