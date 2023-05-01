import SearchConversation from "@components/messages/Conversations/SearchConversation"
import ConversationList from "@components/messages/Conversations/ConversationList"

export default function Conversations(){
    return (
        <div id="conversations-wrapper" className="h-full overflow-y-auto scrollbar-hide">
            <div className="sticky top-0 left-0 bg-theme-gray z-50">
                <h2 className="text-2xl font-medium mb-2">Chats</h2>

                <SearchConversation/>

                <h3 className="text-lg font-medium mb-3">Recent chats</h3>
            </div>

            <ConversationList/>
        </div>
    )
}