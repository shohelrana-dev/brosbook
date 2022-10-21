import React, { useEffect } from 'react'
import { LinearProgress }   from "@mui/material"
import { useRouter }        from "next/router"
import ensureServerSideAuth from "@utils/ensureServerSideAuth"

function Index(){
    const router = useRouter()

    useEffect( () => {
        router.push( '/account/profile' )
    }, [router] )

    return <LinearProgress/>
}

export default Index

export const getServerSideProps = ensureServerSideAuth