"use client"
import React, { PropsWithChildren } from 'react'
import classNames                   from "classnames"
import Sidebar                      from "@components/common/Sidebar"
import useCurrentUser               from "@hooks/useCurrentUser"

function SidebarLayout( { children }: PropsWithChildren ){
    const { user } = useCurrentUser()
    return (
        <div className="bg-theme-gray p-4">
            <main className="max-w-[900px] w-[95%] mx-auto min-h-[93vh]">
                <div className="w-full flex justify-center">
                    <div className={ classNames( 'mx-5', user ? 'w-full lg:w-8/12' : 'w-full max-w-[600px]' ) }>
                        { children }
                    </div>
                    { user ? <aside className="hidden lg:block w-4/12 mt-6">
                        <Sidebar/>
                    </aside> : null }
                </div>
            </main>
        </div>
    )
}

export default SidebarLayout