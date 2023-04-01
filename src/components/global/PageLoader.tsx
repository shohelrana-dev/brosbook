"use client"
import React from 'react'
import { BarLoader } from "react-spinners"

export default function PageLoader(){
    return (
        <div className="flex justify-center items-center h-[70vh] w-full">
            <BarLoader color="rgb(58,141,245)" cssOverride={ { background: "#ddd" } }/>
        </div>
    )
}