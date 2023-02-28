"use client"
import SuggestedPeople from "@components/widgets/SuggestedPeople"
import NewUserMessage from "@components/widgets/NewUserMessage"

export default function Sidebar(){
    return (
        <>
            <SuggestedPeople/>
            <NewUserMessage/>
        </>
    )
}