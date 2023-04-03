"use client"
import React from 'react'
import { BarLoader } from "react-spinners"
import tw from "twin.macro"

const Wrapper = tw.div`absolute top-0 left-0 w-full`


export default function PageLoader(){

    return (
        <Wrapper>
            <BarLoader
                color="rgb(58,141,245)"
                cssOverride={ { background: "#ddd", width: '100%' } }
            />
        </Wrapper>
    )
}