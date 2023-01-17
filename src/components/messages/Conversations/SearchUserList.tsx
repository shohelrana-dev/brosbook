import React from 'react'
import Loading from "@components/common/Loading"
import { User } from "@interfaces/user.interfaces"
import { useSearchUsersQuery } from "@services/usersApi"
import Avatar from "@components/common/Avatar"
import { useLazyGetConversationByParticipantIdQuery } from "@services/conversationApi"
import { useRouter } from "next/navigation"

interface Props {
    query: string
    isSearching: boolean
}

function SearchUserList( { query, isSearching }: Props ){
    const { data, isLoading }              = useSearchUsersQuery( { query, page: 1 } )
    const [getConversationByParticipantId] = useLazyGetConversationByParticipantIdQuery()
    const router                           = useRouter()

    const users = data?.items || []

    async function handleClick( user: User ){
        try {
            const conversation: any = await getConversationByParticipantId( user.id ).unwrap()
            router.push( `/messages/${ conversation.id }` )
        } catch ( e ) {
            console.log( e )
        }
    }

    if( ! isSearching ) return null

    return (
        <div className="relative z-20">
            <div
                className="box max-w-5xl p-3 absolute top-full left-0 w-full mt-3 bg-white drop-shadow-2xl">
                { isLoading ? <Loading/> : null }

                { ( users && users.length > 0 ) ? users.map( user => (
                    <button
                        key={ user.id }
                        onClick={ () => handleClick( user ) }
                        className="box p-3 mb-2 flex items-center bg-white w-full"
                    >
                        <Avatar
                            src={ user.avatar.url }
                            online={ user.active === 1 }
                            alt={ user.fullName }
                            size="small"

                        />
                        <p className="ml-3">
                            { user.fullName }
                        </p>
                    </button>
                ) ) : null }

                { ( ! isLoading && users.length < 1 ) ? (
                    < h2 className="text-xl text-gray-800">No result found</h2>
                ) : null }
            </div>
        </div>
    )
}

export default SearchUserList