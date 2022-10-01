import React                        from 'react'
import { useRouter }                from "next/router"
import { LinearProgress }           from "@mui/material"
import { toast }                    from "react-toastify"
import useAsyncEffect               from "use-async-effect"
import { useVerifyAccountMutation } from "@services/authApi"

function VerifyAccount(){
    const router          = useRouter()
    const [verifyAccount] = useVerifyAccountMutation()

    useAsyncEffect( async() => {
        const email = router.query.email as string
        const key   = router.query.key as string

        try {
            await verifyAccount( { email, key } ).unwrap()
            toast.success( 'Your Account has been verified.' )
        } catch ( err: any ) {
            console.error( err )
            toast.error( err?.data?.message || 'Account verification has been failed.' )
        } finally {
            router.push( '/auth/login' )
        }
    }, [router] )

    return <LinearProgress/>
}

export default VerifyAccount
