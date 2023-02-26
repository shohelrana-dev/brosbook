import React from 'react'
import HomePage from "./HomePage"
import SidebarLayout from "@components/global/SidebarLayout"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: `Home | ${ process.env.NEXT_PUBLIC_APP_NAME }`
}

function Page(){
    return (
        <SidebarLayout>
            <HomePage/>
        </SidebarLayout>
    )
}

export default Page