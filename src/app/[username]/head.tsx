import React from 'react'
import DefaultTags from "@components/global/DefaultTags"
import { cookies } from "next/headers"
import { getUserByUsername } from "@services/index"

interface Props {
    params: {
        username: string
    }
}


export default async function Head( { params }: Props ){
    const user = await getUserByUsername( params.username, cookies() )

    if( ! user ){
        return <DefaultTags/>
    }

    const title       = `${ user?.fullName } (@${ user?.username }) | ${ process.env.NEXT_PUBLIC_APP_NAME }`
    const description = user?.profile?.bio
    const image       = user?.avatar.url
    const url         = `${ process.env.NEXT_PUBLIC_APP_URL }/${ user?.username }`

    return (
        <>
            <DefaultTags/>

            <meta name="description" content={ description }/>
            <title>{ title }</title>

            <meta property="og:type" content="profile"/>
            <meta property="og:url" content={ url }/>
            <meta property="og:title" content={ title }/>
            <meta property="og:description" content={ description }/>
            <meta property="og:image" content={ image }/>
        </>
    )
}