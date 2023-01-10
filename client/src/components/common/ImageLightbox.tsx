"use client"
import React, {useState} from 'react'
import Image, { ImageProps } from 'next/image'
import Lightbox from 'react-image-lightbox'
import classNames from "classnames"
import 'react-image-lightbox/style.css'


export default function ImageLightbox(props: ImageProps) {
    const [ isOpen, setIsOpen] = useState<boolean>(false)

    let { src, className, onClick, ...rest } = props
    className = classNames('cursor-pointer', className)

    return (
        <>
            <Image onClick={() => setIsOpen(!isOpen)} src={src} {...rest} className={className} />
            {isOpen ? <Lightbox mainSrc={src as string} onCloseRequest={() => setIsOpen(false)}/> : null}
        </>
    )
}
