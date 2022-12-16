import React, {ImgHTMLAttributes} from 'react'
import Image from "next/image"
import classNames from "classnames"

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
    online?: boolean
    size?: 'small' | 'medium' | 'large'
}

function Avatar({online, size, src, className}: AvatarProps) {

    let width = 45
    let height = 45
    if (size === 'small') {
        width = 35
        height = 35
    } else if (size === 'large') {
        width = 60
        height = 60
    }

    className = classNames(`rounded-full w-[${width}px] h-[${height}px]`, className)

    return (
        <div style={{width: `${width}px`, height: `${height}px`}} className="relative flex-none">
            {src ? <Image className={className} src={src} fill={true} alt="Profile photo"/> : null}
            {online ? <div
                className="bg-green-500 border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2"/> : null}
        </div>
    )
}

export default Avatar