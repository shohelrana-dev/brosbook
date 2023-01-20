import DefaultTags from "@components/common/DefaultTags"
import getAuthorizationConfig from "../../../utils/getAuthorizationConfig"
import { cookies } from "next/headers"
import { http } from "@boot/axios"
import { Conversation } from "@interfaces/conversation.interfaces"

interface Props {
    params: {
        conversationId: string
    }
}


export default async function Head( { params }: Props ){
    const config                     = getAuthorizationConfig( cookies() )
    const conversation: Conversation = await http.get( `/conversations/${ params.conversationId }`, config ).then( ( res ) => res.data ).catch( () => null )
    return (
        <>
            <DefaultTags/>
            <title>{ `${ conversation.participant.fullName } | ${ process.env.NEXT_PUBLIC_APP_NAME }` }</title>
        </>
    )
}