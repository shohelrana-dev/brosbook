import type {AppProps} from 'next/app'
import {Provider} from 'react-redux'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SimpleReactLightbox from 'simple-react-lightbox'
import {GoogleOAuthProvider} from '@react-oauth/google'

import '@styles/app.css'
import {store} from '@store/index'
import AuthCheck from "@components/common/AuthCheck"

function MyApp({Component, pageProps}: AppProps) {
    const theme = createTheme({
        palette: {
            primary: {
                main: 'rgb(58,141,245)',
            }
        }
    })

    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
                    <SimpleReactLightbox>
                        <ToastContainer position="top-right"/>
                        <AuthCheck>
                            <Component {...pageProps} />
                        </AuthCheck>
                    </SimpleReactLightbox>
                </GoogleOAuthProvider>
            </ThemeProvider>
        </Provider>
    )
}

export default MyApp
