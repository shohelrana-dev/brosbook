import React, { useState } from 'react'
import BasicInput from "@components/global/BasicInput"
import SearchUserList from "@components/global/SearchUserList"
import { User } from "@interfaces/user.interfaces"
import { useCreateConversationMutation, useLazyGetConversationByParticipantIdQuery } from "@services/conversationsApi"
import { useRouter } from "next/navigation"
import { useDebounce, useDebouncedCallback } from "use-debounce"
import { useConfirmAlert } from "react-use-confirm-alert"
import toast from "react-hot-toast"

export default function SearchConversation() {
    const [searchText, setSearchText]      = useState<string>( '' )
    const [dSearchText]                    = useDebounce<string>( searchText, 1000 )
    const [getConversationByParticipantId] = useLazyGetConversationByParticipantIdQuery()
    const [createConversation]             = useCreateConversationMutation()
    const router                           = useRouter()
    const confirmAlert                     = useConfirmAlert()
    const [isFocus, setIsFocus]            = useState<boolean>( false )

    const onBlur = useDebouncedCallback(
        () => {
            setIsFocus( false )
            setSearchText( '' )
        },
        200,
    )

    async function onUserClick( user: User ) {
        try {
            const conversation: any = await getConversationByParticipantId( user.id ).unwrap()
            router.push( `/messages/${ conversation.id }` )
        } catch ( e ) {
            confirmAlert( {
                title: 'Create conversation?',
                message: `Do you want to create a new conversation with ${ user.fullName }?`,
                confirmButtonLabel: "Create",
                onConfirm: async () => {
                    try {
                        const conversation: any = await createConversation( user.id ).unwrap()
                        router.push( `/messages/${ conversation.id }` )
                    } catch ( err ) {
                        console.log( err )
                        toast.error( 'Failed to create conversation.' )
                    }
                }
            } )
        }
    }

    return (
        <div className="mb-3 relative z-10">
            <BasicInput
                label="Search user"
                labelHide={ true }
                onBlur={ onBlur }
                onFocus={ () => setIsFocus( true ) }
                onChange={ ( e ) => {
                    setSearchText( e.target.value )
                } }
                autoComplete="off"
            />
            { isFocus && <SearchUserList onUserClick={ onUserClick } searchText={ dSearchText }/> }
        </div>
    )
}