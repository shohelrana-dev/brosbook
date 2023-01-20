import React, { Suspense } from 'react'
import HomePage from "./HomePage"
import SidebarLayout from "@components/common/SidebarLayout"
import Users from "./blog/users";
import Posts from "./blog/posts";

function Page(){
    return (
        <SidebarLayout>
            <HomePage/>
        </SidebarLayout>
    )
}

export default Page