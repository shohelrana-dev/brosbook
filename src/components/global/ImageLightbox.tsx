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
    imageList?: Media[]
}

export default function ImageLightbox( { image, imageList, className, ...rest }: Props ){
    className = classNames( 'cursor-pointer', className )

    if( ! image && ! imageList ) return null

    const imageElements = imageList?.map( img => (
        <a data-src={ img.url } data-lg-size={ `${ img.width }-${ img.height }` } key={ img.id }>
            <Image src={ img.url } className={ className } { ...rest } width={ 150 } height={ 150 }
                   style={ { objectFit: 'cover', width: '100%', height: '150px' } }/>
        </a>
    ) )

    const imageElement = (
        <a data-src={ image?.url } data-lg-size={ `${ image?.width }-${ image?.height }` }>
            <Image src={ image?.url ! } className={ className } { ...rest }/>
        </a>
    )

    return (
        <LightGallery
            speed={ 500 }
            plugins={ [lgZoom, lgThumbnail] }
            mobileSettings={ { closable: true, showCloseIcon: true, download: true } }
            elementClassNames="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1"
        >
            { imageList && imageList.length > 0 ? ( imageElements ) : imageElement }
        </LightGallery>
    )
}