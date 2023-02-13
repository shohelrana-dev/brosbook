import React  from 'react'
import HomePage from "./HomePage"
import SidebarLayout from "@components/global/SidebarLayout"

function Page(){
    return (
        <SidebarLayout>
            <HomePage/>
        </SidebarLayout>
    )
}

export default Page