import React, { useState } from 'react'
import BasicInput from "@components/global/BasicInput"
import SearchUserList from "@components/global/SearchUserList"
import { User } from "@interfaces/user.interfaces"
import {useCreateConversationMutation, useLazyGetConversationByParticipantIdQuery} from "@services/conversationsApi"
import { useRouter } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { useConfirmAlert } from "react-use-confirm-alert"
import toast, {useToaster} from "react-hot-toast"

export default function SearchConversation(){
    const [searchKey, setSearchKey]        = useState<string>( '' )
    const [getConversationByParticipantId] = useLazyGetConversationByParticipantIdQuery()
    const [createConversation] = useCreateConversationMutation()
    const router                           = useRouter()
    const confirmAlert = useConfirmAlert()
    const [isFocus, setIsFocus]            = useState<boolean>( false )

    const onBlur = useDebouncedCallback(
        () => {
            setIsFocus( false )
            setSearchKey( '' )
        },
        500,
    )

    async function onUserClick( user: User ){
        try {
            const conversation: any = await getConversationByParticipantId( user.id ).unwrap()
            router.push( `/messages/${ conversation.id }` )
        } catch ( e ) {
            console.log( e )
            confirmAlert({
                title: 'Create conversation?',
                message: `Do you want to create a new conversation with ${user.fullName}?`,
                confirmButtonLabel: "Create",
                onConfirm: async () => {
                    try {
                        const conversation: any = await createConversation(user.id).unwrap()
                        router.push( `/messages/${ conversation.id }` )
                    }catch (err) {
                        console.log(err)
                        toast.error('Failed to create conversation.')
                    }
                }
            })
        }
    }

    const onChange = useDebouncedCallback(
        ( value ) => {
            setSearchKey( value )
        },
        200,
    )

    return (
        <div className="mb-3 relative z-10">
            <BasicInput
                label="Search user"
                labelHide={ true }
                onBlur={ onBlur }
                onFocus={ () => setIsFocus( true ) }
                onChange={ ( e ) => {onChange( e.target.value )} }
                autoComplete="off"
            />
            { isFocus ? <SearchUserList onUserClick={ onUserClick } searchKey={ searchKey }/> : null }
        </div>
    )
}