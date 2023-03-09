import React from 'react'
import { PuffLoader } from "react-spinners"

interface LoadingProps {
    loading?: boolean,
    size?: number | string
    className?: string
    color?: string
}

function Loading( { color = "#36d7b7", size = 50, ...rest }: LoadingProps ){
    return (
        <div className="flex justify-center my-2">
            <PuffLoader color={ color } size={ size }  { ...rest }/>
        </div>
    )
}

export default Loading