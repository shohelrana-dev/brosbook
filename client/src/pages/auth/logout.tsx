import { useEffect }      from "react"
import { LinearProgress } from "@mui/material"
import { toast }          from "react-toastify"
import { useRouter }      from "next/router"
import { useDispatch }    from "react-redux"
import { logout }         from "@slices/authSlice"


function Logout(){
    //hooks
    const router   = useRouter()
    const dispatch = useDispatch()

    useEffect( () => {
        dispatch( logout() )
        toast.success( 'You have been logged out.' )
        window.location.href = '/auth/login'
    }, [dispatch, router] )

    return <LinearProgress/>
}

export default Logout