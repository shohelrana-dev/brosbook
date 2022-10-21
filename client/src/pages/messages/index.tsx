import React from 'react'

import MainLayout    from "@components/layouts/MainLayout"
import Conversations from "@components/messages/Conversations"
import { withAuth }  from "@hoc/withEnsureAuth"

function Index() {
    return (
        <MainLayout>
            <div className="max-w-3xl m-auto py-10 px-5">
                <Conversations/>
            </div>
        </MainLayout>
    )
}

export default withAuth( Index )