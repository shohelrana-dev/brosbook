import React, { useEffect } from 'react'
import { useDispatch }      from "react-redux"
import { useRouter }        from "next/navigation"

import MainLayout                       from "@components/layouts/MainLayout"
import Conversations                    from "@components/messages/Conversations"
import MessageBox                       from "@components/messages/MessageBox"
import Information                      from "@components/messages/Information"
import { withAuth }                     from "@hoc/withEnsureAuth"
import { setCurrentConversationAction } from "@actions/chatActions"
import api                              from "../../api/index"
import NavBar                           from "@components/common/NavBar";

function Identifier() {
    const router   = useRouter()
    const dispatch = useDispatch()

    // @ts-ignore
    useEffect( () => loadCurrentConversation(), [ dispatch, router ] )

    async function loadCurrentConversation() {
        const identifier = router.query.identifier as string
        if ( !identifier ) return

        try {
            const { data } = await api.chat.fetchOneConversation( identifier )
            dispatch( setCurrentConversationAction( data?.conversation ) )
        } catch ( err: any ) {
            console.error( err.response?.data?.message )
        }
    }

    return (
        <>
            <NavBar/>
            <div className="grid grid-cols-12 md:px-10 sm:px-4 h-screen pt-16 -mt-16 bg-theme-gray">
                <div className="hidden lg:block lg:col-span-3 p-5 h-full border-r-2 border-gray-20 none">
                    <Conversations/>
                </div>

                <div className="col-span-12 lg:col-span-6 p-5 relative overflow-hidden flex flex-col">
                    { <MessageBox/> }
                </div>

                <div className="hidden lg:block lg:col-span-3 p-5  border-l-2 border-gray-200">
                    <Information/>
                </div>
            </div>
        </>
    )
}

export default withAuth( Identifier )