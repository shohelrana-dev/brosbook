import { PropsWithChildren } from "react"
import { Kanit }             from '@next/font/google'
import Providers             from "./providers"
import Navbar                from "@components/common/Navbar"
import 'react-toastify/dist/ReactToastify.css'
import '@styles/app.css'

const font = Kanit( { weight: '400' } )

export default async function RootLayout( { children }: PropsWithChildren ){
    return (
        <html lang='eng' className={ font.className }>
        <head/>
        <body>
        <Providers>
            <Navbar/>
            { children }
        </Providers>
        </body>
        </html>
    )
}