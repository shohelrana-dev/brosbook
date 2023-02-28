import SidebarLayout from "@components/global/SidebarLayout"
import SuggestionsPage from "./SuggestionsPage"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: `Suggestions`
}

export default function Page(){
    return (
        <SidebarLayout>
            <SuggestionsPage/>
        </SidebarLayout>
    )
}