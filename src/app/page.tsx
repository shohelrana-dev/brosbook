import React from 'react'
import FeedPosts from "./FeedPosts"
import SidebarLayout from "@components/global/SidebarLayout"
import { Metadata } from "next"
import CreatePostForm from "@components/post/CreatePostForm"
import SlidesSuggestions from "@components/global/SlidesSuggestions";

export const metadata: Metadata = {
    title: `Home | ${ process.env.NEXT_PUBLIC_APP_NAME }`
}

export default function Page(){
    return (
        <SidebarLayout>
            <div className="mt-5 mb-4">
                <CreatePostForm/>

                <SlidesSuggestions/>

                <FeedPosts/>
            </div>
        </SidebarLayout>
    )
}
