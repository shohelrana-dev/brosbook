"use client"
import React, { ReactNode } from 'react'
import { store }            from "../store"
import { ToastContainer }   from "react-toastify"
import { Provider }         from "react-redux"
import { ConfirmProvider }  from "@hooks/useConfirm"

function Providers( { children }: { children: ReactNode } ){
    return (
        <Provider store={ store }>
            <ConfirmProvider>
                { children }
                <ToastContainer position="bottom-center"/>
            </ConfirmProvider>
        </Provider>
    )
}

export default Providers