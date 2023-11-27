import { PropsWithChildren } from 'react'
import Sidebar from "@components/global/Sidebar"

function SidebarLayout({ children }: PropsWithChildren) {
    return (
        <div className="max-w-[920px] mx-auto px-3 lg:px-0">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-x-5">
                {children}

                <Sidebar />
            </div>
        </div>
    )
}

export default SidebarLayout