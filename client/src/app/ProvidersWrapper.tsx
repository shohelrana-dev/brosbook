"use client"
import React, {ReactNode} from 'react'
import {store} from "@store/index"
import {createTheme, ThemeProvider} from "@mui/material/styles"
import SimpleReactLightbox from "simple-react-lightbox"
import {ToastContainer} from "react-toastify"
import {Provider} from "react-redux"
import Boot from "@components/common/Boot"

const theme = createTheme( {
    palette: {
        primary: {
            main: 'rgb(58,141,245)',
        }
    }
} )

function ProvidersWrapper({children}:{children: ReactNode}) {
    return (
        <Provider store={ store }>
            <ThemeProvider theme={ theme }>
                <SimpleReactLightbox>
                    <Boot/>
                    <ToastContainer position="top-right"/>
                    {children}
                </SimpleReactLightbox>
            </ThemeProvider>
        </Provider>
    )
}

export default ProvidersWrapper