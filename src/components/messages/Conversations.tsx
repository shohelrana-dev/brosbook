"use client"
import SearchConversation from "@components/messages/Conversations/SearchConversation"
import ConversationList from "@components/messages/Conversations/ConversationList"
import useNavbarHeight from "@hooks/useNavbarHeight"

export default function Conversations(){
    const navbarHeight = useNavbarHeight()

    return (
        <div id="conversations-wrapper" style={{height: `calc(100vh - ${navbarHeight})`}} className="overflow-y-auto">
            <div className="sticky top-0 left-0 bg-theme-gray z-50">
                <h2 className="text-2xl font-medium mb-2 mt-6">Chats</h2>

                <SearchConversation/>

                <h3 className="text-lg font-medium mb-3">Recent chats</h3>
            </div>

            <ConversationList/>
        </div>
    )
}