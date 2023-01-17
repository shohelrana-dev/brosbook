import ProfilePostsPage from "./ProfilePostsPage"
import { http } from "@boot/axios"
import authorizationConfig from "@utils/authorizationConfig"
import { cookies } from "next/headers"


interface Props {
    params: { username: string }
}

export default async function Page( { params }: Props ){
    const config = authorizationConfig( cookies() )
    const user   = await http.get( `/users/by/username/${ params.username }`, config ).then( ( res ) => res.data ).catch( () => null )
    const posts  = await http.get( `/posts?userId=${ user?.id }`, config ).then( ( res ) => res.data ).catch( () => null )

    return <ProfilePostsPage user={ user } initialPosts={ posts }/>
}
