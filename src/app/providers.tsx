"use client"
import React, { ReactNode } from 'react'
import { store } from "../store"
import { Toaster } from 'react-hot-toast'
import { Provider } from "react-redux"
import { ConfirmAlertProvider } from "@hooks/useConfirmAlert"
import { UnauthorizedPopupProvider } from "@hooks/useUnauthorzedAlert"
import Boot from "@components/common/Boot"

function Providers( { children }: { children: ReactNode } ){

    return (
        <Provider store={ store }>
            <Boot/>
            <UnauthorizedPopupProvider>
                <ConfirmAlertProvider>
                    { children }
                    <Toaster/>
                </ConfirmAlertProvider>
            </UnauthorizedPopupProvider>
        </Provider>
    )
}

export default Providers