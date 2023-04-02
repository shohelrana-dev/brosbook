"use client"
import React from 'react'
import { BarLoader } from "react-spinners"

export default function PageLoader(){
    return (
        <BarLoader
            color="rgb(58,141,245)"
            cssOverride={ { background: "#ddd", width: '100%' } }
        />
    )
}