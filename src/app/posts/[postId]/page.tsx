import PostCard from "@components/post/PostCard"
import SidebarLayout from "@components/global/SidebarLayout"
import { getPostById } from "@services/index"
import { cookies } from "next/headers"
import NotFound from "../../not-found"

interface Props {
    params: {
        postId: string
    }
}

export const revalidate = 0

export default async function SinglePostPage( { params }: Props ){
    const post = await getPostById( params.postId, cookies() )

    if( ! post ) return <NotFound/>

    return (
        <SidebarLayout>
            <div className="mt-5">
                <PostCard post={ post! } isCommentsShow={ true }/>
            </div>
        </SidebarLayout>
    )
}