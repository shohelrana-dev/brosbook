import React, { ReactElement } from 'react'
import NavBar                  from "@components/common/NavBar"
import Sidebar                 from "@components/common/Sidebar"

interface LayoutProps {
    children: ReactElement | ReactElement[]
}


function MainLayout( { children }: LayoutProps ) {
    return (
        <>
            <NavBar/>
            <div className="bg-theme-gray">
                <main className="container min-h-[93vh] flex">
                    <div className="w-8/12 mx-5">
                        { children }
                    </div>
                    <aside className="w-4/12 mt-6">
                        <Sidebar/>
                    </aside>
                </main>
            </div>
        </>
    )
}

export default MainLayout