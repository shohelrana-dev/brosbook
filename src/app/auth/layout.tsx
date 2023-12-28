import React, { PropsWithChildren } from 'react'

function Layout( { children }: PropsWithChildren ){
    return (
        <div className="h-screen flex flex-wrap flex-col bg-theme-gray">
            <div className="w-90 mx-auto mt-12 lg:mt-28 relative z-50">
                { children }
            </div>
        </div>
    )
}

export default Layout