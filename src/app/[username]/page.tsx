import ProfilePostsPage from "./ProfilePostsPage"
import { cookies } from "next/headers"
import { getPostsByAuthorId, getUserByUsername } from "@services/index"

interface Props {
    params: { username: string }
}

export default async function Page( { params }: Props ){
    const nextCookies = cookies()
    const user        = await getUserByUsername( params.username, nextCookies )
    const posts       = await getPostsByAuthorId( user?.id!, nextCookies )

    return <ProfilePostsPage user={ user! } initialPosts={ posts! }/>
}
