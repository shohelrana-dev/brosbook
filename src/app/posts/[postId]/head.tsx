import { ReactNode } from 'react'
import DefaultTags from "@components/common/DefaultTags"
import { getPostById } from "@services/index"
import { cookies } from "next/headers"

interface Props {
    params: {
        postId: string
    },
    children: ReactNode
}

export default async function Head( { params }: Props ){
    const post = await getPostById( params.postId, cookies() )

    return (
        <>
            <DefaultTags/>
            <title>{ `${ post?.body || 'Post image' } | ${ process.env.NEXT_PUBLIC_APP_NAME }` }</title>
        </>
    )
}