"use client"
import React, { useRef } from 'react'
import { store } from "@store/index"
import { userLoggedIn } from "@slices/authSlice"
import { User } from "@interfaces/user.interfaces"

interface Props {
    user: User | null
}

export default function PreLoader( { user }: Props ){
    const loaded = useRef( false )

    if( ! loaded.current && user ){
        store.dispatch( userLoggedIn( user ) )
        loaded.current = true
    }

    console.log(store.getState())

    return null
}