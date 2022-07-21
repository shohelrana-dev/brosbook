import React, { useEffect }         from 'react'
import { useRouter }                from "next/router"
import { LinearProgress }           from "@mui/material"
import { useAppDispatch }           from "@store/store"
import { toast }                    from "react-toastify"
import useAsyncEffect               from "use-async-effect"
import { useVerifyAccountMutation } from "@services/authApi"

function Token(){
    const router                                               = useRouter()
    const dispatch                                             = useAppDispatch()
    const [verifyAccount, { isSuccess, isError, data, error }] = useVerifyAccountMutation()

    const errorData = ( error && 'data' in error && error.data as any ) || {}

    useAsyncEffect( verifyToken, [router, dispatch] )

    useEffect( () => {
        isSuccess && toast.success( data?.message )
        isError && toast.error( errorData.message )

        if( isSuccess || isError ){
            router.push( '/auth/login' )
        }

    }, [isSuccess, isError, router] )

    async function verifyToken(){
        const token = router.query.token as string
        if( ! token ) return

        verifyAccount( token )
    }

    return <LinearProgress/>
}

export default Token
