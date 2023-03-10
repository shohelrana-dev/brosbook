import SuggestedPeople from "@components/widgets/SuggestedPeople"
import NewUserMessage from "@components/widgets/NewUserMessage"
import isAuthenticated from "@utils/isAuthenticated"
import { cookies } from "next/headers"

export default function Sidebar(){
    const isAuth = isAuthenticated( cookies() )

    if( isAuth ){
        return <SuggestedPeople/>
    } else{
        return <NewUserMessage/>
    }
}