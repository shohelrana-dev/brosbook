"use client"
import React, {ReactNode} from 'react'
import {store} from "@store/index"
import {Toaster} from 'react-hot-toast'
import {Provider} from "react-redux"
import {UnauthorizedPopupProvider} from "@hooks/useUnauthorzedAlert"
import {ConfirmAlertProvider} from "react-use-confirm-alert"
import {ThemeProvider, CssBaseline} from "@mui/material"
import theme from "@utils/theme"

export default function Providers({children}: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                {/*<CssBaseline/>*/}
                <UnauthorizedPopupProvider>
                    <ConfirmAlertProvider>
                        {children}
                        <Toaster/>
                    </ConfirmAlertProvider>
                </UnauthorizedPopupProvider>
            </ThemeProvider>
        </Provider>
    )
}