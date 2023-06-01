"use client"
import React from 'react'
import tw from "twin.macro"
import { LinearProgress } from "@mui/material"

const Wrapper = tw.div`absolute top-0 left-0 w-full`


export default function PageLoader() {

    return (
        <Wrapper>
            <LinearProgress color="success"/>
        </Wrapper>
    )
}