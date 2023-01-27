"use client"
import Conversations from "@components/messages/Conversations"
import { useEffect, useState } from "react"

export default function Page(){
    const [headerHeight, setHeaderHeight] = useState<number>()

    useEffect( () => {
        setHeaderHeight( document.querySelector( '#appHeader' )?.clientHeight )
    }, [] )

    return (
        <div className="h-screen flex overflow-hidden md:px-10 sm:px-4"
             style={ { marginTop: `-${ headerHeight }px`, paddingTop: headerHeight } }>
            <div className="w-full lg:w-1/4 p-5 lg:border-r-2 border-gray-20 ">
                <Conversations/>
            </div>

            <div className="hidden lg:block lg:w-3/4 h-full p-5">
                <h3 className="text-2xl font-bold">Select a message</h3>
                <p>Choose from your existing conversations, start a new one, or just keep swimming.</p>
            </div>
        </div>
    )
}