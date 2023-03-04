"use client"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { userLoggedOut } from "@slices/authSlice"
import Loading from "@components/global/Loading"
import { baseApi } from "@services/baseApi"
import { removeCookie } from "tiny-cookie"


function LogoutPage(){
    //hooks
    const router   = useRouter()
    const dispatch = useDispatch()

    useEffect( () => {
        removeCookie( 'access_token' )
        dispatch( userLoggedOut() )
        toast.success( 'Logged out.' )

        setTimeout( () => {
            dispatch( baseApi.util.resetApiState() )
        }, 1000 )

        router.push( '/auth/login' )
    }, [dispatch, router] )

    return <Loading/>
}

export default LogoutPage