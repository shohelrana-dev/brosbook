import React              from 'react'
import { useRouter }      from "next/router"
import { LinearProgress } from "@mui/material"
import { useAppDispatch } from "@store/index"
import { verifyAccount }  from "@slices/authSlice"
import { toast }          from "react-toastify"
import useAsyncEffect     from "use-async-effect"

function Token(){
    const router   = useRouter()
    const dispatch = useAppDispatch()

    useAsyncEffect( verifyToken, [router, dispatch] )

    async function verifyToken(){
        const token = String( router.query.token )
        if( ! token || token === 'undefined' ) return

        try {
            const data = await dispatch( verifyAccount( token ) ).unwrap()
            toast.success( data.message )
            await router.push( '/auth/login' )
        } catch ( err: any ) {
            toast.error( err?.message || 'Verification failed' )
            await router.push( '/auth/login' )
        }
    }

    return <LinearProgress/>
}

export default Token
