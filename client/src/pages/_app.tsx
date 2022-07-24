import { AppProps }                   from "next/app"
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { ToastContainer }             from 'react-toastify'
import SimpleReactLightbox            from 'simple-react-lightbox'
import { GoogleOAuthProvider }        from '@react-oauth/google'
import 'react-toastify/dist/ReactToastify.css'

import '@styles/app.css'
import { wrapper }                    from '@store/store'
import { authApi }                    from "@services/authApi"

function MyApp( { Component, pageProps }: AppProps ){

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

MyApp.getInitialProps = wrapper.getInitialAppProps( ( store ) => async( { Component, ctx } ) => {
    await store.dispatch<any>( authApi.endpoints.getAuthUser.initiate() )

    const pageProps = Component.getInitialProps ? await Component.getInitialProps( ctx ) : {}
    return { pageProps }
} )

export default wrapper.withRedux( MyApp )
