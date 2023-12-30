import { PropsWithChildren } from 'react'

export default function Layout( { children }: PropsWithChildren ){
    return (
        <div className="h-screen flex flex-wrap flex-col bg-theme-gray">
            <div className="w-100 max-w-full mx-auto mt-12 lg:mt-28 relative z-50">
                { children }
            </div>
        </div>
    )
}