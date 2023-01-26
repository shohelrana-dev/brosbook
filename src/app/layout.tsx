import { PropsWithChildren } from "react"
import { Kanit } from '@next/font/google'
import Providers from "./providers"
import Navbar from "@components/common/Navbar"
import { cookies } from "next/headers"
import '@styles/app.css'
import { getCurrentUser } from "@services/index"

const font = Kanit( { weight: '400' } )

export default async function RootLayout( { children }: PropsWithChildren ){
    const currentUser = await getCurrentUser( cookies() )

    return (
        <html lang='eng' className={ font.className }>
        <head/>
        <body className="bg-theme-gray">
        <Providers>
            <Navbar user={ currentUser! }/>
            { children }
        </Providers>
        </body>
        </html>
    )
}