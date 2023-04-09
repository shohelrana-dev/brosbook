import SearchConversation from "@components/messages/Conversations/SearchConversation"
import ConversationList from "@components/messages/Conversations/ConversationList"

export default function Conversations(){
    return (
        <>
            <h2 className="text-2xl font-medium mb-2">Chats</h2>

            {/*Search user*/ }
            <SearchConversation/>

            {/*Conversation List*/ }
            <ConversationList/>
        </>
    )
}