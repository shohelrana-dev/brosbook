import { useEffect }      from "react"
import { LinearProgress } from "@mui/material"
import { toast }          from "react-toastify"
import { useRouter }      from "next/router"
import { useLogoutQuery } from "@services/authApi"


function Logout(){
    //hooks
    const router                              = useRouter()
    const { isError, isSuccess, data, error } = useLogoutQuery()

    const errorData = ( error && 'data' in error && error.data as any ) || {}

    useEffect( () => {
        isSuccess && toast.success( data?.message )
        isError && toast.error( errorData.message )

        if( isSuccess ){
            router.push( '/auth/login' )
        }
    }, [isSuccess, isError, router] )

    return <LinearProgress/>
}

export default Logout