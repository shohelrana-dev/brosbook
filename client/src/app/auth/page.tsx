import { useRouter }      from "next/navigation"
import { LinearProgress } from "@mui/material"
import { useEffect }      from "react"

function AuthPage() {
    const router = useRouter()

    useEffect( () => {
        router.push( '/auth/login' )
    }, [router] )

    return <LinearProgress/>
}

export default AuthPage
