import SuggestedPeople from "@components/widgets/SuggestedPeople"
import { getCurrentUser } from "@services/index"
import NewUserMessage from "@components/widgets/NewUserMessage"
import { cookies } from "next/headers"

export default async function Sidebar(){
    const user = await getCurrentUser( cookies() )

    return (
        <div>
            { user ? <SuggestedPeople/> : null }
            { ! user ? <NewUserMessage/> : null }
        </div>
    )
}