import React, { PropsWithChildren } from 'react'
import Sidebar from "@components/global/Sidebar"

function SidebarLayout( { children }: PropsWithChildren ){
    return (
        <div className="max-w-[920px] w-full mx-auto">
            <div className="w-full flex justify-center">
                <div className="md:mx-5 w-full lg:w-8/12">
                    { children }
                </div>
                <aside className="hidden lg:block w-4/12 mt-4">
                    <Sidebar/>
                </aside>
            </div>
        </div>
    )
}

export default SidebarLayout