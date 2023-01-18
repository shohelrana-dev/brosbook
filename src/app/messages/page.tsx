"use client"
import React from 'react'
import Conversations from "@components/messages/Conversations"
import useCurrentUser from "@hooks/useCurrentUser"
import AnimatePage from "@components/common/AnimatePage"

function Page(){
    const {} = useCurrentUser( { redirectTo: '/auth/login' } )

    return (
        <AnimatePage>
            <div className="h-screen grid grid-cols-12 md:px-10 sm:px-4 pt-16 -mt-16 bg-theme-gray">
                <div className="col-span-12 lg:col-span-3 p-5 h-full lg:border-r-2 border-gray-20 none">
                    <Conversations/>
                </div>

                <div className="hidden lg:block col-span-6 p-5 relative overflow-hidden flex flex-col">
                    <div className="align-self-center">
                        <h3 className="text-2xl font-bold">Select a message</h3>
                        <p>Choose from your existing conversations, start a new one, or just keep swimming.</p>
                    </div>
                </div>
            </div>
        </AnimatePage>
    )
}

export default Page