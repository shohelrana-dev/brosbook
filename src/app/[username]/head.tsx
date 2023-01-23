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

    return (
        <>
            <DefaultTags/>
            <meta content="profile" property="og:type"/>
            <meta content={ description } property="og:description"/>
            {/*@ts-ignore*/ }
            <meta description={ description } name="description"/>
            <meta content={ user?.avatar.url } property="og:image"/>
            <meta content={ title } property="og:title"/>
            <title>{ title }</title>
        </>
    )
}