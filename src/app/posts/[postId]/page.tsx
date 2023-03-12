import PostCard from "@components/post/PostCard"
import { getPostById } from "@services/index"
import { cookies } from "next/headers"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const generateMetadata = async( { params }: Props ): Promise<Metadata> => {
    const post = await getPostById( params.postId, cookies() )

    if( ! post ) return { title: "Post not found" }

    const ogTitle     = `${ post?.author.fullName } on ${ process.env.NEXT_PUBLIC_APP_NAME }`
    const title       = `${ post?.author.fullName } on ${ process.env.NEXT_PUBLIC_APP_NAME }: "${ post?.body.replace( /[\r\n]/gm, '' ) }"`
    const description = post?.body.replace( /[\r\n]/gm, '' )
    const imageUrl    = post?.image?.url
    const url         = `${ process.env.NEXT_PUBLIC_APP_URL }/posts/${ post?.id }`
    const authorUrl   = `${ process.env.NEXT_PUBLIC_APP_URL }/${ post?.author.username }`

    return {
        title: post.body ? title : ogTitle,
        description,
        authors: {
            name: post?.author.fullName!,
            url: authorUrl
        },
        keywords: [process.env.NEXT_PUBLIC_APP_NAME!, 'post', post?.author.username!],
        other: {
            "og:type": 'article',
            "og:url": url,
            "og:title": ogTitle,
            "og:description": description!,
            "og:image": imageUrl!,
            "og:image:secure": imageUrl!,
            "og:image:url": imageUrl!,
            "og:image:alt": post.body ? title : ogTitle,
            "article:published_time": post?.createdAt!
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

    return <PostCard post={ post! } isCommentsShow={ true }/>
}