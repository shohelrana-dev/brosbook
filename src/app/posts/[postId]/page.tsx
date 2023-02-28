import PostCard from "@components/post/PostCard"
import SidebarLayout from "@components/global/SidebarLayout"
import { getPostById } from "@services/index"
import { cookies } from "next/headers"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const generateMetadata = async( { params }: Props ): Promise<Metadata> => {
    const post        = await getPostById( params.postId, cookies() )
    const title       = `${ post?.author.fullName } on ${ process.env.NEXT_PUBLIC_APP_NAME }`
    const description = post?.body.replace( /[\r\n]/gm, '' )
    const image       = post?.image?.url
    const url         = `${ process.env.NEXT_PUBLIC_APP_URL }/posts/${ post?.id }`

    return {
        title,
        description,
        other: {
            "og:type": 'article',
            "og:url": url,
            "og:title": title,
            "og:description": description!,
            "og:image": image!
        }
    }
}

interface Props {
    params: {
        postId: string
    }
}

export const revalidate = 0

export default async function SinglePostPage( { params }: Props ){
    const post = await getPostById( params.postId, cookies() )

    if( ! post ) return notFound()

    return (
        <SidebarLayout>
            <div className="mt-5">
                <PostCard post={ post! } isCommentsShow={ true }/>
            </div>
        </SidebarLayout>
    )
}