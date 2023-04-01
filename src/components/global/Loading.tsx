import React from 'react'
import { PuffLoader } from "react-spinners"

interface LoadingProps {
    loading?: boolean,
    size?: number | string
    className?: string
    color?: string
}

function Loading( { color = "#36d7b7", loading = true, ...rest }: LoadingProps ){
    if( ! loading ) return null

    return (
        <div className="flex justify-center my-2">
            <PuffLoader color={ color }  { ...rest }/>
        </div>
    )
}

export default Loading