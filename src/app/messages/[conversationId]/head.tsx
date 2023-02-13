import DefaultTags from "@components/global/DefaultTags"
import { cookies } from "next/headers"
import { getConversationById } from "@services/index"

interface Props {
    params: {
        conversationId: string
    }
}


export default async function Head( { params }: Props ){
    const conversation = await getConversationById( params.conversationId, cookies() )

    return (
        <>
            <DefaultTags/>
            <title>{ `${ conversation?.participant.fullName } | ${ process.env.NEXT_PUBLIC_APP_NAME }` }</title>
        </>
    )
}