import { PropsWithChildren } from "react"
import { Kanit } from '@next/font/google'
import Providers from "./providers"
import Navbar from "@components/common/Navbar"
import 'react-toastify/dist/ReactToastify.css'
import '@styles/app.css'
import authorizationConfig from "@utils/authorizationConfig"
import { cookies } from "next/headers"
import { User } from "@interfaces/user.interfaces"
import { http } from "@boot/axios"

const font = Kanit( { weight: '400' } )

export default async function RootLayout( { children }: PropsWithChildren ){
    const config            = authorizationConfig( cookies() )
    const currentUser: User = await http.get( `/users/me`, config ).then( ( res ) => res.data ).catch( () => null )

    return (
        <html lang='eng' className={ font.className }>
        <head/>
        <body>
        <Providers>
            <Navbar user={ currentUser }/>
            { children }
        </Providers>
        </body>
        </html>
    )
}