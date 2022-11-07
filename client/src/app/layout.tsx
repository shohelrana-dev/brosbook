import {PropsWithChildren} from "react"
import { Kanit } from '@next/font/google'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from "@components/common/Sidebar"
import ProvidersWrapper from "./ProvidersWrapper"
import '@styles/app.css'
import NavBar from "@components/common/NavBar"

const font = Kanit({weight: '400'})

export default function RootLayout ({children}:PropsWithChildren){
    return (
        <html lang='eng' className={font.className}>
            <head>
                <meta property="og:site_name" content="brosbook"/>
                <meta property="twitter:card" content="summary"/>
                <meta property="og:type" content="website"/>
                <link rel="shortcut icon" href="/images/favicon.png" />
            </head>
            <body>
                <ProvidersWrapper>
                    <NavBar />
                    <div className="bg-theme-gray p-4">
                        <main className="max-w-4xl mx-auto min-h-[93vh]">
                            <div className="w-full flex">
                                <div className="w-8/12 mx-5">
                                    {children}
                                </div>
                                <aside className="w-4/12 mt-6">
                                    <Sidebar />
                                </aside>
                            </div>
                        </main>
                    </div>
                </ProvidersWrapper>
            </body>
        </html>
    )
}