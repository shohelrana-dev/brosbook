"use client"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { logout } from "@slices/authSlice"
import Loading from "@components/common/Loading"
import Cookies from "js-cookie"
import { baseApi } from "@services/baseApi"


function LogoutPage(){
    //hooks
    const router   = useRouter()
    const dispatch = useDispatch()

    useEffect( () => {
        Cookies.remove( 'access_token' )
        dispatch( logout() )
        toast.success( 'Logged out.' )

        setTimeout( () => {
            dispatch( baseApi.util.resetApiState() )
        }, 1000 )

        router.push( '/auth/login' )
    }, [dispatch, router] )

    return <Loading/>
}

export default LogoutPage