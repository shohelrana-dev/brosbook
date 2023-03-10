import React from 'react'
import FeedPosts from "./FeedPosts"
import SidebarLayout from "@components/global/SidebarLayout"
import { Metadata } from "next"
import CreatePostForm from "@components/post/CreatePostForm"
import isAuthenticated from "@utils/isAuthenticated"
import { cookies } from "next/headers"

export const metadata: Metadata = {
    title: `Home | ${ process.env.NEXT_PUBLIC_APP_NAME }`
}

function Page(){
    return (
        <SidebarLayout>
            <div className="mt-5 mb-4">
                { isAuthenticated( cookies() ) ? <CreatePostForm/> : null }
                <FeedPosts/>
            </div>
        </SidebarLayout>
    )
}

export default Page