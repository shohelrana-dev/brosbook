"use client"
import React from 'react'
import Image, { ImageProps } from 'next/image'
import classNames from "classnames"
import LightGallery from 'lightgallery/react'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'

//css
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'
import { Media } from "@interfaces/index.interfaces"

interface Props extends Omit<ImageProps, "src"> {
    image?: Media
}

export default function ImageLightbox( { image, className, ...rest }: Props ){
    className = classNames( 'cursor-pointer', className )

    if(!image || !image.url) return null

    return (
        <LightGallery speed={ 500 } mode="lg-fade">
            <a data-src={ image.url } data-lg-size={ `${ image.width }-${ image.height }` }>
                <Image src={ image.url } className={ className } { ...rest }/>
            </a>
        </LightGallery>
    )
}