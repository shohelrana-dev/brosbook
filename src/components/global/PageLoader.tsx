"use client"
import React, { useMemo } from 'react'
import { BarLoader } from "react-spinners"
import tw from "twin.macro";
import useAuthState from "@hooks/useAuthState";

const Wrapper = tw.div`fixed left-0 w-full`

export default function PageLoader(){
    const { isAuthenticated } = useAuthState()

    const top = useMemo( () => {
        if( isAuthenticated ) return 75
        else return 0
    }, [] )

    return (
        <Wrapper style={ { top } }>
            <BarLoader
                color="rgb(58,141,245)"
                cssOverride={ { background: "#ddd", width: '100%' } }
            />
        </Wrapper>
    )
}