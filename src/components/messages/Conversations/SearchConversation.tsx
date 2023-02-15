import React, { useState } from 'react'
import BasicInput from "@components/global/BasicInput"
import SearchUserList from "@components/global/SearchUserList"
import { User } from "@interfaces/user.interfaces"
import { useLazyGetConversationByParticipantIdQuery } from "@services/conversationApi"
import { useRouter } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export default function SearchConversation(){
    const [searchKey, setSearchKey]        = useState<string>( '' )
    const [getConversationByParticipantId] = useLazyGetConversationByParticipantIdQuery()
    const router                           = useRouter()
    const [isBlur, setIsBlur]              = useState<boolean>( false )

    const onBlur = useDebouncedCallback(
        () => {
            setIsBlur( false )
        },
        500,
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
        200,
    )

    return (
        <div className="mb-3 relative">
            <BasicInput
                label="Search user"
                labelHide={ true }
                onBlur={ onBlur }
                onFocus={ () => setIsBlur( true ) }
                onChange={ ( e ) => {onChange( e.target.value )} }
            />
            { isBlur ? <SearchUserList onUserClick={ onUserClick } searchKey={ searchKey }/> : null }
        </div>
    )
}