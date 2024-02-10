import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPostById } from '~/services/index'
import siteMetadata from '~/utils/siteMetadata'
import SinglePostPage from './SinglePostPage'

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
   const post = await getPostById(params.postId, cookies())

   if (!post) return { title: 'Post not found' }

   const ogTitle = `${post?.author.fullName} on ${siteMetadata.appName}`
   const title = `${post?.author.fullName} on ${siteMetadata.appName}: "${post?.body.replace(
      /[\r\n]/gm,
      ''
   )}"`
   const description = post?.body.replace(/[\r\n]/gm, '')
   const imageUrl = post?.image?.url
   const url = `${siteMetadata.siteUrl}/posts/${post?.id}`
   const authorUrl = `${siteMetadata.siteUrl}/${post?.author.username}`

   return {
      title: post.body ? title : ogTitle,
      description,
      authors: {
         name: post?.author.fullName!,
         url: authorUrl,
      },
      keywords: [siteMetadata.appName, 'post', post?.author.username!],
      openGraph: {
         type: 'article',
         url: url,
         title: ogTitle,
         description: description!,
         images: imageUrl!,
      },
   }
}

interface Props {
   params: {
      postId: string
   }
}

export const revalidate = 0

export default async function Page({ params }: Props) {
   const post = await getPostById(params.postId, cookies())

   if (!post) return notFound()

   return <SinglePostPage initialPost={post} />
}
