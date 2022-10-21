import React, { ReactNode } from 'react'
import NavBar from "@components/common/NavBar"
import Sidebar from "@components/common/Sidebar"

interface LayoutProps {
    children: ReactNode
    showSidebar?: boolean
}


function MainLayout({ children, showSidebar = true }: LayoutProps) {
    if (!showSidebar) return (
        <>
            <NavBar />
            <div className="bg-theme-gray">
                <main className="max-w-2xl mx-auto min-h-[93vh] flex">
                    <div className="w-full">
                        {children}
                    </div>
                </main>
            </div>
        </>
    )
    else return (
        <>
            <NavBar />
            <div className="bg-theme-gray">
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
        </>
    )
}

export default MainLayout