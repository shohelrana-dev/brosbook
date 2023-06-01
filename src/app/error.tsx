"use client"
import { Button } from "@mui/material"
import { IoReload as ReloadIcon } from "react-icons/io5"
import { BiErrorCircle as ErrorIcon } from "react-icons/bi"

export default function GlobalError( { error, reset }: { error: Error; reset: () => void; } ){
    return (
        <div className="w-full h-full flex items-center justify-center flex-col py-5">
            <div className="mb-5">
                <ErrorIcon size={40} className="text-gray-700"/>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Something went wrong. Try reloading.</h2>
            <Button variant="contained" onClick={ reset } className="flex">
                <ReloadIcon size={ 20 }/>&nbsp;Try again
            </Button>
        </div>
    )
}
