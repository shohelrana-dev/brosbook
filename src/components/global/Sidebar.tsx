"use client"
import SuggestedPeople from "@components/widgets/SuggestedPeople"
import NewUserMessage from "@components/widgets/NewUserMessage"
import useMediaQuery from "@hooks/useMediaQuery"

export default function Sidebar() {
    const isLaptopOrDesktop = useMediaQuery('(min-width: 768px)')

    if (!isLaptopOrDesktop) return null

    return (
        <aside className="mt-5">
            <SuggestedPeople />
            <NewUserMessage />
        </aside>
    )
}