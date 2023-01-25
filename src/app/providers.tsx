"use client"
import React, { ReactNode } from 'react'
import { store } from "../store"
import { Toaster } from 'react-hot-toast'
import { Provider } from "react-redux"
import { ConfirmProvider } from "@hooks/useConfirm"
import Boot from "@components/common/Boot"

function Providers( { children }: { children: ReactNode } ){

    return (
        <Provider store={ store }>
            <Boot/>
            <ConfirmProvider>
                { children }
                <Toaster/>
            </ConfirmProvider>
        </Provider>
    )
}

export default Providers