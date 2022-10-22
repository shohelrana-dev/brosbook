import React from 'react'
import Image, { ImageProps } from 'next/image'
import { SRLWrapper } from 'simple-react-lightbox'

export default function LightboxImage({ src, ...rest }: ImageProps) {
    return (
        <SRLWrapper>
            <a href={src as string}>
                <Image src={src} {...rest} />
            </a>
        </SRLWrapper>
    )
}
