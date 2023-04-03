"use client"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { userLoggedOut } from "@slices/authSlice"
import { baseApi } from "@services/baseApi"
import { removeCookie } from "tiny-cookie"
import PageLoader from "@components/global/PageLoader"


function LogoutPage(){
    //hooks
    const router   = useRouter()
    const dispatch = useDispatch()

    useEffect( () => {
        removeCookie( 'access_token' )
        dispatch( userLoggedOut() )

        setTimeout( () => {
            dispatch( baseApi.util.resetApiState() )
        }, 1000 )

        router.replace( '/auth/login' )
        toast.success( 'Logged out.' )
    }, [dispatch, router] )

    return <PageLoader/>
}

export default LogoutPage