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

    return (
        <>
            <DefaultTags/>
            <title>{ `${user.fullName} (@${ user.username }) | ${ process.env.NEXT_PUBLIC_APP_NAME }` }</title>
        </>
    )
}