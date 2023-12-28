"use client"
import { LinearProgress } from "@mui/material"


export default function PageLoader() {
    return (
        <div className="absolute top-0 left-0 w-full">
            <LinearProgress color="success"/>
        </div>
    )
}