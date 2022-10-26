import React from 'react'
import Image, { ImageProps } from 'next/image'
import { SRLWrapper } from 'simple-react-lightbox'

export default function LightboxImage(props: ImageProps) {
    const { src, alt, layout = "responsive", objectFit = "contain", ...rest } = props
    return (
        <SRLWrapper>
            <a href={src as string}>
                <Image src={src} alt={alt} layout={layout} objectFit={objectFit} {...rest} />
            </a>
        </SRLWrapper>
    )
}
