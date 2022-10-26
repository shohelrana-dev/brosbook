import React                        from 'react'
import { useRouter }                from "next/router"
import { LinearProgress }           from "@mui/material"
import { toast }                    from "react-toastify"
import useAsyncEffect             from "use-async-effect"
import { useVerifyEmailMutation } from "@services/authApi"

function EmailVerify(){
    const router          = useRouter()
    const [verifyEmail] = useVerifyEmailMutation()

    useAsyncEffect( async() => {
        const token   = router.query.token as string

        try {
            await verifyEmail( token ).unwrap()
            toast.success( 'Your email has been verified.' )
        } catch ( err: any ) {
            console.error( err )
            toast.error( err?.data?.message || 'Email verification was failed.' )
        } finally {
            router.push( '/auth/login' )
        }
    }, [router] )

    return <LinearProgress/>
}

export default EmailVerify
