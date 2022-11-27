import React, { useState } from 'react'
import { useRouter }       from "next/navigation"

import { User }                         from "@interfaces/user.interfaces"
import Avatar           from "@components/common/Avatar"
import api              from "../../../api/index"
import { Conversation } from "@interfaces/chat.interfaces"


interface SingleSearchUserProps {
    user: User
}

function SearchUserItem( { user }: SingleSearchUserProps ) {

    const router                  = useRouter()
    const [ loading, setLoading ] = useState<boolean>()

    async function handleClick() {
        setLoading( true )
        try {
            const { data }       = await api.chat.createConversation( user.id )
            const { identifier } = data.conversation as Conversation

            await router.push( `/messages/${ identifier }` )
        } catch ( err: any ) {
            console.error( err.response?.data?.message )
        } finally {
            setLoading( false )
        }
    }

    return (
        <button
            onClick={ handleClick }
            className="box p-3 mb-2 flex items-center bg-white w-full"
            disabled={ loading }
        >
            <Avatar
                src={ user.avatar }
                online={ user.active === 1 }
                alt={ user.fullName }
                size="small"

            />
            <p className="ml-3">
                { user.fullName }
            </p>
        </button>
    )
}

export default SearchUserItem