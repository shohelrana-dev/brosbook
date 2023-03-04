"use client"
import React, { ReactNode } from 'react'
import { store, persistor } from "../store"
import { Toaster } from 'react-hot-toast'
import { Provider } from "react-redux"
import { ConfirmAlertProvider } from "@hooks/useConfirmAlert"
import { UnauthorizedPopupProvider } from "@hooks/useUnauthorzedAlert"
import Boot from "@components/global/Boot"
import { ThemeProvider } from "@material-tailwind/react"
import { PersistGate } from "redux-persist/integration/react"
import 'react-loading-skeleton/dist/skeleton.css'

function Providers({ children }: { children: ReactNode }) {

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider>
                    <UnauthorizedPopupProvider>
                        <ConfirmAlertProvider>
                            <Boot />
                            {children}
                            <Toaster />
                        </ConfirmAlertProvider>
                    </UnauthorizedPopupProvider>
                </ThemeProvider>
            </PersistGate>
        </Provider>
    )
}

export default Providers