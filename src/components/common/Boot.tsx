import React, { useEffect } from 'react'
import { useDispatch } from "react-redux"
import { useGetCurrentUserQuery } from "@services/usersApi"
import { setAuth } from "@slices/authSlice"

export default function Boot(){
    const dispatch       = useDispatch()
    const { data: user } = useGetCurrentUserQuery()

    useEffect( () => {
        if( user && Object.keys( user! ).length > 0 ){
            dispatch( setAuth( user! ) )
        }
    }, [user] )

    return null
}