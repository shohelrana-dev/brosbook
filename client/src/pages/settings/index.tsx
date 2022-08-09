import React, { useEffect } from 'react'
import { withAuth }         from "@hoc/withEnsureAuth"
import { LinearProgress }   from "@mui/material"
import { useRouter }        from "next/router"

function Index() {
    const router = useRouter()

    useEffect( () => {
        router.push( '/settings/edit_profile' )
    }, [ router ] )

    return <LinearProgress/>
}

export default withAuth( Index )