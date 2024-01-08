"use client"
import { useRouter }      from "next/navigation"
import { useEffect }      from "react"
import Loader from "@/components/global/Loader"

function AuthPage() {
    const router = useRouter()

    useEffect( () => {
        router.push( '/auth/login' )
    }, [router] )

    return <Loader/>
}

export default AuthPage
