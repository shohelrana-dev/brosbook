"use client"
import React, { ReactNode } from 'react'
import { store } from "../store"
import { Toaster } from 'react-hot-toast'
import { Provider } from "react-redux"
import { ConfirmProvider } from "@hooks/useConfirm"
import { UnauthorizedPopupProvider } from "@hooks/useUnauthorzedPopup"
import Boot from "@components/common/Boot"

function Providers( { children }: { children: ReactNode } ){

    return (
        <Provider store={ store }>
            <Boot/>
            <UnauthorizedPopupProvider>
                <ConfirmProvider>
                    { children }
                    <Toaster/>
                </ConfirmProvider>
            </UnauthorizedPopupProvider>
        </Provider>
    )
}

export default Providers