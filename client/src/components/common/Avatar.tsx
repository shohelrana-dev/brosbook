import React, { ImgHTMLAttributes } from 'react'
import Image                        from "next/image"

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
    online?: boolean
    size?: 'small' | 'medium' | 'large'
}

function Avatar( { online, size, src}: AvatarProps ) {

    let width  = 45
    let height = 45
    if ( size === 'small' ) {
        width  = 35
        height = 35
    } else if ( size === 'large' ) {
        width  = 60
        height = 60
    }

    return (
        <div className="relative flex-none">
            { src && <Image className="rounded-full" src={ src } width={ width } height={ height } alt="Profile photo" /> }
            { online &&
                <div className="bg-green-500 border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2"/> }
        </div>
    )
}

export default Avatar