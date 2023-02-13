import { PropsWithChildren } from "react"
import { Kanit } from '@next/font/google'
import Providers from "./providers"
import Navbar from "@components/global/Navbar"
import { cookies } from "next/headers"
import '@styles/app.css'

const font = Kanit( { weight: '400' } )

export default async function RootLayout( { children }: PropsWithChildren ){
    const hasAccessToken = !! cookies().get( 'access_token' )?.value

    return (
        <html lang='eng' className={ font.className }>
        <head/>
        <body className="bg-theme-gray">
        <Providers>
            <Navbar hasAccessToken={ hasAccessToken }/>
            { children }
        </Providers>
        </body>
        </html>
    )
}