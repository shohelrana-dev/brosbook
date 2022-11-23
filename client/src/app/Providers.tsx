"use client"
import React, {ReactNode} from 'react'
import {store} from "../store"
import {ToastContainer} from "react-toastify"
import {Provider} from "react-redux"
import Boot from "@components/common/Boot"
import {ConfirmProvider} from "@hooks/useConfirm"

function Providers({children}:{children: ReactNode}) {
    return (
        <Provider store={ store }>
            <ConfirmProvider>
                <Boot/>
                {children}
                <ToastContainer position="top-right"/>
            </ConfirmProvider>
        </Provider>
    )
}

export default Providers