"use client"
import { useRouter }      from "next/navigation"
import { useEffect }      from "react"
import Loading from "@components/common/Loading"

function AuthPage() {
    const router = useRouter()

    useEffect( () => {
        router.push( '/auth/login' )
    }, [router] )

    return <Loading/>
}

export default AuthPage
