import { useRouter }      from "next/router"
import { LinearProgress } from "@mui/material"
import { useEffect }      from "react"

function Index() {
    const router = useRouter()

    useEffect( () => {
        router.push( '/auth/login' )
    }, [router] )

    return <LinearProgress/>
}

export default Index
