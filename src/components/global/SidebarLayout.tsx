import React, { PropsWithChildren, Suspense } from 'react'
import Loading from "@components/global/Loading"
import Sidebar from "@components/global/Sidebar"

function SidebarLayout( { children }: PropsWithChildren ){
    return (
        <main className="max-w-[920px] w-full mx-auto">
            <div className="w-full flex justify-center">
                <div className="md:mx-5 w-full lg:w-8/12">
                    { children }
                </div>
                <aside className="hidden lg:block w-4/12 mt-4">
                    <Suspense fallback={ <Loading size={ 40 }/> }>
                        <Sidebar/>
                    </Suspense>
                </aside>
            </div>
        </main>
    )
}

export default SidebarLayout