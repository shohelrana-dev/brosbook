import { useEffect }      from "react"
import { LinearProgress } from "@mui/material"
import { useDispatch }    from "react-redux"

import { logoutAction } from "@actions/authActions"
import { withAuth }     from "@utils/withAuth"


function Logout() {
    //hooks
    const dispatch = useDispatch()

    useEffect( () => {
        dispatch( logoutAction() )
    }, [ dispatch ] )

    return <LinearProgress/>
}

export default withAuth( Logout )