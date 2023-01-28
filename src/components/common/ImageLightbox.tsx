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


export default function ImageLightbox( props: ImageProps ){
    let { src, className, ...rest } = props
    className                       = classNames( 'cursor-pointer', className )

    return (
        <LightGallery speed={ 500 } plugins={ [lgThumbnail, lgZoom] } mode="lg-fade">
            <a data-src={ `/_next/image?url=${ src }&w=640&q=75` } data-lg-size="1406-1390">
                <Image src={ src } { ...rest } className={ className }/>
            </a>
        </LightGallery>
    )
}
