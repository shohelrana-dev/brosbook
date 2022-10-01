import { useEffect }      from "react"
import { LinearProgress } from "@mui/material"
import { toast }          from "react-toastify"
import { useRouter }      from "next/router"
import { useDispatch }    from "react-redux";
import { logout }         from "@features/authSlice"


function Logout(){
    //hooks
    const router   = useRouter()
    const dispatch = useDispatch()

    useEffect( () => {
        dispatch( logout() )
        router.push( '/auth/login' )
        toast.success( 'You have been logged out.' )
    }, [dispatch, router] )

    return <LinearProgress/>
}

export default Logout