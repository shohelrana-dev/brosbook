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
        if( isSuccess ){
            toast.success( data?.message )
            location.href = '/auth/login'
        }
    }, [isSuccess] )

    useEffect( () => { isError && toast.error( errorData.message )}, [isError] )

    return <LinearProgress/>
}

export default Logout