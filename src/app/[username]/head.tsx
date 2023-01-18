import React, { ReactNode } from 'react'
import DefaultTags from "@components/common/DefaultTags"
import { User } from "@interfaces/user.interfaces"
import { http } from "@boot/axios"
import authorizationConfig from "@utils/authorizationConfig"
import { cookies } from "next/headers"

interface Props {
    params: {
        username: string
    }
}


export default async function Head( { params }: Props ){
    const config     = authorizationConfig( cookies() )
    const user: User = await http.get( `/users/by/username/${ params.username }`, config ).then( ( res ) => res.data ).catch( () => null )

    const title       = `${ user.fullName } (@${ user.username }) | ${ process.env.NEXT_PUBLIC_APP_NAME }`
    const description = user.profile?.bio

    return (
        <>
            <DefaultTags/>
            <meta content="profile" property="og:type"/>
            <meta content={ description } property="og:description"/>
            {/*@ts-ignore*/}
            <meta description={ description } name="description"/>
            <meta content={ user.avatar.url } property="og:image"/>
            <meta content={ title } property="og:title"/>
            <title>{ title }</title>
        </>
    )
}