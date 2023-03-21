"use client"
import React, { ReactNode } from 'react'
import { store } from "@store/index"
import { Toaster } from 'react-hot-toast'
import { Provider } from "react-redux"
import { UnauthorizedPopupProvider } from "@hooks/useUnauthorzedAlert"
import Boot from "@components/global/Boot"
import { ThemeProvider } from "@material-tailwind/react"
import 'react-loading-skeleton/dist/skeleton.css'
import { ConfirmAlertProvider } from "react-use-confirm-alert"

export default function Providers( { children }: { children: ReactNode } ){
    return (
        <Provider store={ store }>
            <ThemeProvider>
                <UnauthorizedPopupProvider>
                    <ConfirmAlertProvider>
                        <Boot/>
                        { children }
                        <Toaster/>
                    </ConfirmAlertProvider>
                </UnauthorizedPopupProvider>
            </ThemeProvider>
        </Provider>
    )
}