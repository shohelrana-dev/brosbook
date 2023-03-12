import React, { PropsWithChildren } from 'react'
import SidebarLayout from "@components/global/SidebarLayout"

export default function Layout( { children }: PropsWithChildren ){
    return (
        <SidebarLayout>
            <div className="mt-5">
                { children }
            </div>
        </SidebarLayout>
    )
}