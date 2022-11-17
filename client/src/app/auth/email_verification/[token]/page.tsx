"use client"
import { useRouter }                from "next/navigation"
import { toast }                    from "react-toastify"
import useAsyncEffect             from "use-async-effect"
import { useVerifyEmailMutation } from "@services/authApi"
import Loading from "@components/common/Loading"

type Props = {
    params: {token: string}
}

export default function EmailVerifyPage({params}: Props){
    const router          = useRouter()
    const [verifyEmail] = useVerifyEmailMutation()

    useAsyncEffect( async() => {
        const token   = params.token

        try {
            await verifyEmail( token ).unwrap()
            toast.success( 'Your email was verified.' )
        } catch ( err: any ) {
            console.error( err )
            toast.error( err?.data?.message || 'Email verification was failed.' )
        } finally {
            router.push( '/auth/login' )
        }
    }, [router] )

    return <Loading/>
}