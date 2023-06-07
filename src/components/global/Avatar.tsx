import React, { ImgHTMLAttributes } from 'react'
import Image from "next/image"
import classNames from "classnames"
import Skeleton from "react-loading-skeleton"

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
    online?: boolean
    size?: 'small' | 'medium' | 'large'
}

export default function Avatar( { online, size = 'medium', src, className }: AvatarProps ){

    let width
    let height
    if( size === 'small' ){
        width  = 35
        height = 35
    } else if( size === 'medium' ){
         width  = 45
         height = 45
    }else if( size === 'large' ){
        width  = 60
        height = 60
    }

    className = classNames( `rounded-full object-cover`, className )

    if( ! src ){
        return <Skeleton width={ width } height={ height } circle/>
    }

    return (
        <div className="flex-none rounded-full relative" style={ { width, height } }>
            { src ? <Image
                priority
                className={ className }
                src={ src }
                width={ width }
                height={ height }
                style={ { height: `${ height }px` } }
                alt="User profile photo"
            /> : null }
            { online ? <div
                className="bg-green-500 border-solid border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2"/> : null }
        </div>
    )
}