import React, { useState } from 'react'
import ConversationItem from "@components/messages/Conversations/ConversationItem"
import { useGetConversationsQuery } from "@services/conversationApi"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import Loading from "@components/common/Loading"
import { Conversation } from "@interfaces/conversation.interfaces"
import { useDebouncedCallback } from "use-debounce"
import BasicInput from "@components/common/BasicInput"
import SearchUserList from "@components/messages/Conversations/SearchUserList"
import { useSelector } from "react-redux"
import { selectChatState } from "@slices/chatSlice"

function Conversations(){
    //hooks
    const [query, setQuery]             = useState<string>( '' )
    const { isLoading }                 = useGetInfiniteListQuery<Conversation>( useGetConversationsQuery, {} )
    const { conversations }             = useSelector( selectChatState )
    const [isSearching, setIsSearching] = useState<boolean>( false )

    const onChange = useDebouncedCallback(
        ( value ) => {
            setQuery( value )
        },
        500,
    )

    const onBlur = useDebouncedCallback(
        () => {
            setIsSearching( false )
        },
        200,
    )

    return (
        <>
            <h2 className="text-2xl font-medium mb-2">Chats</h2>

            {/*Search user*/ }
            <div className="mb-3">
                <BasicInput
                    label="Search user"
                    labelHide={ true }
                    onBlur={ onBlur }
                    onFocus={ () => setIsSearching( true ) }
                    onChange={ ( e ) => {onChange( e.target.value )} }
                />
                <SearchUserList query={ query } isSearching={ isSearching }/>
            </div>

            {/*Conversations*/ }
            { ! isSearching ? (
                <div>
                    <h2 className="text-lg font-medium mb-3">Recent chats</h2>
                    { isLoading ? <Loading/> : null }

                    { conversations && conversations.map( ( conversation: Conversation ) => (
                        <ConversationItem conversation={ conversation } key={ conversation.id }/>
                    ) ) }

                    { ! isLoading && conversations.length < 1 && (
                        <p className="text-gray-700">You have no conversation</p>
                    ) }
                </div>
            ) : null }
        </>
    )
}

export default Conversations