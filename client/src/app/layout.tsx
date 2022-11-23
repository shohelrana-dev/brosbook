import {PropsWithChildren} from "react"
import { Kanit } from '@next/font/google'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from "@components/common/Sidebar"
import Providers from "./Providers"
import Navbar from "@components/common/Navbar"
import authorizationConfig from "@utils/authorizationConfig"
import {cookies} from "next/headers"
import {http} from "@boot/axios"
import classNames from "classnames"
import '@styles/app.css'

const font = Kanit({weight: '400'})

export default async function RootLayout ({children}:PropsWithChildren){
    const config = authorizationConfig(cookies())
    const user = await http.get(`/users/me`, config).then((res) => res.data).catch(() => null)

    return (
        <html lang='eng' className={font.className}>
            <head>
                <meta property="og:site_name" content="brosbook"/>
                <meta property="twitter:card" content="summary"/>
                <meta property="og:type" content="website"/>
                <title>{process.env.NEXT_PUBLIC_APP_NAME || 'Brosbook'}</title>
                <link rel="shortcut icon" href="/images/favicon.png" />
            </head>
            <body>
                <Providers>
                    <Navbar />
                    <div className="bg-theme-gray p-4">
                        <main className="max-w-[900px] w-[95%] mx-auto min-h-[93vh]">
                            <div className="w-full flex justify-center">
                                <div className={classNames('mx-5', user ? 'w-full lg:w-8/12' : 'w-full max-w-[600px]' )}>
                                    {children}
                                </div>
                                { user ? <aside className="hidden lg:block w-4/12 mt-6">
                                    <Sidebar />
                                </aside> : null}
                            </div>
                        </main>
                    </div>
                </Providers>
            </body>
        </html>
    )
}