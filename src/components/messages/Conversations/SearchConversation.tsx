import React, { useState } from 'react'
import BasicInput from "@components/common/BasicInput"
import SearchUserList from "@components/common/SearchUserList"
import { User } from "@interfaces/user.interfaces"
import { useSearchUsersQuery } from "@services/usersApi"
import { useLazyGetConversationByParticipantIdQuery } from "@services/conversationApi"
import { useRouter } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export default function SearchConversation(  ){
    const [searchKey, setSearchKey]           = useState<string>( '' )
    const { data, isLoading: isUsersLoading } = useSearchUsersQuery( { key: searchKey, page: 1 } )
    const [getConversationByParticipantId]    = useLazyGetConversationByParticipantIdQuery()
    const router                              = useRouter()
    const [isBlur, setIsBlur]                 = useState<boolean>( false )

    const users = data?.items || []

    const onBlur = useDebouncedCallback(
        () => {
            setIsBlur( false )
        },
        200,
    )

    async function onUserClick( user: User ){
        try {
            const conversation: any = await getConversationByParticipantId( user.id ).unwrap()
            router.push( `/messages/${ conversation.id }` )
        } catch ( e ) {
            console.log( e )
        }
    }

    const onChange = useDebouncedCallback(
        ( value ) => {
            setSearchKey( value )
        },
        500,
    )

    return (
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
    )
}