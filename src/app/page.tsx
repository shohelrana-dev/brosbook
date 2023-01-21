import React  from 'react'
import HomePage from "./HomePage"
import SidebarLayout from "@components/common/SidebarLayout"

function Page(){
    return (
        <SidebarLayout>
            <HomePage/>
        </SidebarLayout>
    )
}

export default Page