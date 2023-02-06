"use client"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { logout } from "@slices/authSlice"
import Loading from "@components/common/Loading"


function LogoutPage(){
    //hooks
    const router   = useRouter()
    const dispatch = useDispatch()

    useEffect( () => {
        dispatch( logout() )
        toast.success( 'Logged out.' )
        window.location.href = '/auth/login'
    }, [dispatch, router] )

    return <Loading/>
}

export default LogoutPage