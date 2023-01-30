import React, { ReactNode } from 'react'
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

    const title       = `${ post?.author.fullName } on ${ process.env.NEXT_PUBLIC_APP_NAME }`
    const description = post?.body
    const image       = post?.image?.url
    const url         = `${ process.env.NEXT_PUBLIC_APP_URL }/posts/${ post?.id }`

    return (
        <>
            <DefaultTags/>

            <title>{ `${ title }: ${ post?.body || 'Image' }` }</title>
            <meta name="description" content={ description }/>

            <meta property="og:type" content="article"/>
            <meta property="og:url" content={ url }/>
            <meta property="og:title" content={ title }/>
            <meta property="og:description" content={ description }/>
            <meta property="og:image" content={ image }/>

            <meta property="twitter:title" content={ title }/>
            <meta property="twitter:image" content={ image }/>
            <meta property="twitter:description" content={ description }/>
        </>
    )
}