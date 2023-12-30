"use client"
import { LinearProgress } from "@mui/material"
import { selectNavbarHeight } from "@slices/navbarHeightSlice"
import { useSelector } from "react-redux"


export default function PageLoader() {
    const navbarHeight                      = useSelector(selectNavbarHeight)

    return (
        <div className="fixed top-0 left-0 w-full" style={{top: `${navbarHeight}`}}>
            <LinearProgress color="success"/>
        </div>
    )
}