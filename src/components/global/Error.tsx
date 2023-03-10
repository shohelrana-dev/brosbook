import React from 'react'
import { Alert } from "@material-tailwind/react"
import { BiErrorCircle as ErrorIcon } from "react-icons/bi"

export default function Error( { message }: { message: string } ){
    return (
        <Alert color="red" className="bg-red-400">
            <div className="flex gap-3 items-center">
                <ErrorIcon size={20}/>
                <p>{ message }</p>
            </div>
        </Alert>
    )
}