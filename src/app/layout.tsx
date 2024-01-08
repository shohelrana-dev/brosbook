import '@/assets/styles/app.css'
import 'react-loading-skeleton/dist/skeleton.css'
import { PropsWithChildren } from "react"
import Providers from "./providers"
import Navbar from "@/components/navbar/Navbar"
import { Metadata } from "next"
import { getCurrentUser } from "@/services/index"
import { cookies } from "next/headers"
import PreLoader from "@/components/global/PreLoader"
import { Kanit } from "next/font/google"
import siteMetadata from '@/utils/siteMetadata'

export const metadata: Metadata = {
    title: {
        default: siteMetadata.title,
        template: `%s | ${siteMetadata.appName}`,
    },
    description: siteMetadata.description,
    keywords: siteMetadata.keywords,
    metadataBase: new URL(siteMetadata.siteUrl),
    applicationName: siteMetadata.appName,
    creator: siteMetadata.creator,
    openGraph: {
        title: siteMetadata.appName,
        description: siteMetadata.description,
        images: siteMetadata.titledLogo
    },
    twitter: {
        card: 'summary_large_image',
        title: siteMetadata.appName,
        description: siteMetadata.description,
        images: siteMetadata.titledLogo
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: false,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
}

const kanit = Kanit({
    weight: ['400', '500', '600'],
    subsets: ['latin'],
    variable: '--font-kanit',
    display: "swap"
})

export default async function RootLayout({ children }: PropsWithChildren) {
    const user = await getCurrentUser(cookies())

    return (
        <html lang='eng'>
            <head />
            <body className={`${kanit.className} bg-primary-gray`}>
                <Providers>
                    <PreLoader user={user!} />
                    <Navbar />
                    <main>
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    )
}