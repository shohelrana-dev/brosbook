import SuggestedPeople from "@components/widgets/SuggestedPeople"
import SearchUser from "@components/widgets/SearchUser"
import { getCurrentUser } from "@services/index"
import NewUserMessage from "@components/widgets/NewUserMessage"
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