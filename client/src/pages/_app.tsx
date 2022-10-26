import { AppProps }                   from "next/app"
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { ToastContainer }             from 'react-toastify'
import SimpleReactLightbox            from 'simple-react-lightbox'
import { GoogleOAuthProvider }        from '@react-oauth/google'
import { useSelector }                from "react-redux"
import { NextApiRequest }             from "next"
import 'react-toastify/dist/ReactToastify.css'

import { wrapper }                         from '@store/store'
import { selectAuthState, setAccessToken } from "@slices/authSlice"
import '@styles/app.css'
import {usersApi} from "@services/usersApi";

function MyApp( { Component, pageProps }: AppProps ){
    const { isAuthenticated } = useSelector( selectAuthState )
    console.log( 'isAuthenticated', isAuthenticated )

    const theme = createTheme( {
        palette: {
            primary: {
                main: 'rgb(58,141,245)',
            }
        }
    } )

    return (
        <ThemeProvider theme={ theme }>
            <GoogleOAuthProvider clientId={ process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID! }>
                <SimpleReactLightbox>
                    <ToastContainer position="top-right"/>
                    <Component { ...pageProps } />
                </SimpleReactLightbox>
            </GoogleOAuthProvider>
        </ThemeProvider>
    )
}

MyApp.getInitialProps = wrapper.getInitialAppProps( ( store ) => async( appContext ) => {
    const req          = appContext.ctx.req as NextApiRequest
    const access_token = req?.cookies?.access_token
    await store.dispatch( setAccessToken( access_token! ) )
    await store.dispatch( usersApi.endpoints.getCurrentUser.initiate() )

    const pageProps = appContext.Component.getInitialProps ? await appContext.Component.getInitialProps( appContext.ctx ) : {}
    return { pageProps }
} )

export default wrapper.withRedux( MyApp )
