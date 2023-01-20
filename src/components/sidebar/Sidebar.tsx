import SuggestedPeople from "@components/sidebar/SuggestedPeople"
import SearchUser from "@components/sidebar/SearchUser"
import { getCurrentUser } from "@services/index"
import NewUserMessage from "@components/sidebar/NewUserMessage"
import { cookies } from "next/headers"

export default async function Sidebar(){
    const user = await getCurrentUser( cookies() )

    return (
        <div>
            <SearchUser/>
            { user ? <SuggestedPeople/> : null }
            { ! user ? <NewUserMessage/> : null }
        </div>
    )
}