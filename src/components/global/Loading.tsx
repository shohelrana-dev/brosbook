import React from 'react'
import { PuffLoader } from "react-spinners"
import classNames from "classnames"

interface LoadingProps {
    loading?: boolean,
    size?: number | string
    className?: string
    wrapperClassName?: string
    color?: string
}

export default function Loading( { color = "#14CB15", className, wrapperClassName, loading = true, ...rest }: LoadingProps ){
    if( typeof loading === 'boolean' && !loading ) return null

    return (
        <div className={classNames('flex justify-center my-2', wrapperClassName)}>
            <PuffLoader color={ color }  { ...rest }/>
        </div>
    )
}