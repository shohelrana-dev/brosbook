"use client"
import React, { PropsWithChildren } from 'react'
import Sidebar                      from "@components/common/Sidebar"

function SidebarLayout( { children }: PropsWithChildren ){

    return (
        <div className="bg-theme-gray">
            <main className="max-w-[920px] w-full mx-auto min-h-[93vh]">
                <div className="w-full flex justify-center">
                    <div className="md:mx-5 w-full lg:w-8/12">
                        { children }
                    </div>
                    <aside className="hidden lg:block w-4/12 mt-6">
                        <Sidebar/>
                    </aside>
                </div>
            </main>
        </div>
    )
}

export default SidebarLayout