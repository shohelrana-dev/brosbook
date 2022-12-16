"use client"
import React, {ReactNode} from 'react'
import {store} from "../store"
import {ToastContainer} from "react-toastify"
import {Provider} from "react-redux"
import Boot from "@components/common/Boot"
import {ConfirmProvider} from "@hooks/useConfirm"
import {SessionProvider} from "next-auth/react"

function Providers({children}: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <SessionProvider>
                <ConfirmProvider>
                    <Boot/>
                    {children}
                    <ToastContainer position="top-right"/>
                </ConfirmProvider>
            </SessionProvider>
        </Provider>
    )
}

export default Providers