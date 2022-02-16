import React, { useEffect } from 'react'
import { useRouter }        from "next/router"
import { LinearProgress }   from "@mui/material"
import { useDispatch }      from "react-redux"

import { verifyAccountAction } from "@actions/authActions"
import { withGuest }           from 'utils/withAuth'

function Token() {
    const router   = useRouter()
    const dispatch = useDispatch()

    useEffect( verifyToken, [ router, dispatch ] )

    function verifyToken() {
        const token = String( router.query.token )
        if ( !token || token === 'undefined' ) return

        dispatch( verifyAccountAction( token ) )
    }

    return <LinearProgress/>
}

export default withGuest( Token )
