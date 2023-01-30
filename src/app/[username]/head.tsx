import React from 'react'
import DefaultTags from "@components/common/DefaultTags"
import { cookies } from "next/headers"
import { getUserByUsername } from "../../services"

interface Props {
    params: {
        username: string
    }
}


export default async function Head( { params }: Props ){
    const user = await getUserByUsername( params.username, cookies() )

    const title       = `${ user?.fullName } (@${ user?.username }) | ${ process.env.NEXT_PUBLIC_APP_NAME }`
    const description = user?.profile?.bio
    const image       = user?.avatar.url
    const url         = `${ process.env.NEXT_PUBLIC_APP_URL }/${ user?.username }`

    return (
        <>
            <DefaultTags/>

            <meta property="og:type" content="profile"/>
            <meta property="og:url" content={ url }/>
            <meta property="og:title" content={ title }/>
            <meta property="og:description" content={ description }/>
            <meta property="og:image" content={ image }/>

            <meta property="twitter:title" content={ title }/>
            <meta property="twitter:image" content={ image }/>
            <meta property="twitter:description" content={ description }/>

            {/*@ts-ignore*/ }
            <meta name="description" content={ description }/>
            <title>{ title }</title>
        </>
    )
}