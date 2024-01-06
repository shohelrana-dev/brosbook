import React, { ImgHTMLAttributes } from 'react'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import { twMerge } from 'tailwind-merge'

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
    online?: boolean
    size?: 'small' | 'medium' | 'large'
}

export default function Avatar({ online, size = 'medium', src, className }: AvatarProps) {
    let _size
    switch (size) {
        case 'small':
            _size = 35
            break

        case 'medium':
            _size = 45
            break

        case 'large':
            _size = 60
            break
    }

    const sizeStyle = {
        width: `${_size}px`,
        height: `${_size}px`,
    }

    className = twMerge(`rounded-full object-cover`, className)

    if (!src) {
        return (
            <Skeleton
                width={_size}
                height={_size}
                circle
            />
        )
    }

    return (
        <div
            className='relative flex-none rounded-full'
            style={sizeStyle}
        >
            {src ? (
                <Image
                    priority
                    className={className}
                    src={src}
                    width={_size}
                    height={_size}
                    style={sizeStyle}
                    placeholder='blur'
                    blurDataURL={src}
                    alt='User profile photo'
                />
            ) : null}

            {online ? (
                <>
                    <div className='bg-green-500 border-solid border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2' />
                    <div className='bg-green-500 w-3 h-3 absolute right-0 bottom-0 rounded-full opacity-70 animate-ping' />
                </>
            ) : null}
        </div>
    )
}
