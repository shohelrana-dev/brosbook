import type { AppProps }              from 'next/app'
import { Provider }                   from 'react-redux'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { ToastContainer }             from 'react-toastify'
import SimpleReactLightbox            from 'simple-react-lightbox'
import { GoogleOAuthProvider }        from '@react-oauth/google'
import 'react-toastify/dist/ReactToastify.css'

import '@styles/app.css'
import { store }                      from '@store/store'
import CheckAuth                      from "@components/common/CheckAuth"

function MyApp( { Component, pageProps }: AppProps ){
    const theme = createTheme( {
        palette: {
            primary: {
                main: 'rgb(58,141,245)',
            }
        }
    } )

    return (
        <Provider store={ store }>
            <ThemeProvider theme={ theme }>
                <GoogleOAuthProvider clientId={ process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID! }>
                    <SimpleReactLightbox>
                        <CheckAuth/>
                        <ToastContainer position="top-right"/>
                        <Component { ...pageProps } />
                    </SimpleReactLightbox>
                </GoogleOAuthProvider>
            </ThemeProvider>
        </Provider>
    )
}

export default MyApp
