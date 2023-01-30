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

    return (
        <>
            <DefaultTags/>
            <meta content={ post?.body } property="og:description"/>
            {/*@ts-ignore*/ }
            <meta description={ post.body } name="description"/>
            { post?.image ? <meta content={ post.image.url } property="og:image"/> : null }
            <meta content={ post?.body } property="og:title"/>
            <title>{ `${ post?.body || 'Post image' } | ${ process.env.NEXT_PUBLIC_APP_NAME }` }</title>
        </>
    )
}