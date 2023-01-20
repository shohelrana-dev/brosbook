import React, { useState } from 'react'
import ConversationItem from "@components/messages/Conversations/ConversationItem"
import { useGetConversationsQuery, useLazyGetConversationByParticipantIdQuery } from "@services/conversationApi"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import Loading from "@components/common/Loading"
import { Conversation } from "@interfaces/conversation.interfaces"
import { useDebouncedCallback } from "use-debounce"
import BasicInput from "@components/common/BasicInput"
import SearchUserList from "@components/messages/Conversations/SearchUserList"
import { useSelector } from "react-redux"
import { selectChatState } from "@slices/chatSlice"
import { useSearchUsersQuery } from "@services/usersApi";
import { useRouter } from "next/navigation";
import { User } from "@interfaces/user.interfaces";

function Conversations(){
    //hooks
    const [searchKey, setSearchKey]           = useState<string>( '' )
    const { isLoading }                       = useGetInfiniteListQuery<Conversation>( useGetConversationsQuery, {} )
    const { conversations }                   = useSelector( selectChatState )
    const [isBlur, setIsBlur]                 = useState<boolean>( false )
    const { data, isLoading: isUsersLoading } = useSearchUsersQuery( { key: searchKey, page: 1 } )
    const [getConversationByParticipantId]    = useLazyGetConversationByParticipantIdQuery()
    const router                              = useRouter()

    const onChange = useDebouncedCallback(
        ( value ) => {
            setSearchKey( value )
        },
        500,
    )

    const onBlur = useDebouncedCallback(
        () => {
            setIsBlur( false )
        },
        200,
    )

    const users = data?.items || []

    async function onUserClick( user: User ){
        try {
            const conversation: any = await getConversationByParticipantId( user.id ).unwrap()
            router.push( `/messages/${ conversation.id }` )
        } catch ( e ) {
            console.log( e )
        }
    }

    return (
        <>
            <h2 className="text-2xl font-medium mb-2">Chats</h2>

            {/*Search user*/ }
            <div className="mb-3">
                <BasicInput
                    label="Search user"
                    labelHide={ true }
                    onBlur={ onBlur }
                    onFocus={ () => setIsBlur( true ) }
                    onChange={ ( e ) => {onChange( e.target.value )} }
                />
                { isBlur ?
                    <SearchUserList isLoading={ isUsersLoading } onUserClick={ onUserClick } users={ users }/> : null }
            </div>

            {/*Conversations*/ }
            { ! isBlur ? (
                <div>
                    <h2 className="text-lg font-medium mb-3">Recent chats</h2>
                    { isLoading ? <Loading size={ 35 }/> : null }

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