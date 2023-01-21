import React, { PropsWithChildren, Suspense } from 'react'
import Loading from "@components/common/Loading"
import Sidebar from "@components/common/Sidebar"

function SidebarLayout( { children }: PropsWithChildren ){
    return (
        <div className="bg-theme-gray">
            <main className="max-w-[920px] w-full mx-auto min-h-[93vh]">
                <div className="w-full flex justify-center">
                    <div className="md:mx-5 w-full lg:w-8/12">
                        { children }
                    </div>
                    <aside className="hidden lg:block w-4/12 mt-6">
                        <Suspense fallback={ <Loading size={40}/>}>
                            {/*@ts-ignore*/}
                            <Sidebar/>
                        </Suspense>
                    </aside>
                </div>
            </main>
        </div>
    )
}

export default SidebarLayout