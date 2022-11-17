"use client"
import React, {ReactNode} from 'react'
import {store} from "../store"
import SimpleReactLightbox from "simple-react-lightbox"
import {ToastContainer} from "react-toastify"
import {Provider} from "react-redux"
import Boot from "@components/common/Boot"

function ProvidersWrapper({children}:{children: ReactNode}) {
    return (
        <Provider store={ store }>
            <SimpleReactLightbox>
                <Boot/>
                <ToastContainer position="top-right"/>
                {children}
            </SimpleReactLightbox>
        </Provider>
    )
}

export default ProvidersWrapper