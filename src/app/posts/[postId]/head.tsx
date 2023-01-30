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
    const image       = post?.image.url
    const url         = `${ process.env.NEXT_PUBLIC_APP_URL }/posts/${ post?.id }`

    return (
        <>
            <DefaultTags/>
            <meta content="article" property="og:type"/>
            <meta content={ url } property="og:url"/>
            <meta content={ title } property="og:title"/>
            <meta content={ description } property="og:description"/>
            <meta content={ image } property="og:image"/>
            {/*@ts-ignore*/ }
            <meta description={ description } name="description"/>
            <title>{ `${ title }: ${post?.body || 'Image'}` }</title>
        </>
    )
}