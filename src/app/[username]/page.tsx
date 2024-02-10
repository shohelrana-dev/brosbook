import { cookies } from 'next/headers'
import { getPostsByAuthorId, getUserByUsername } from '~/services/index'
import UserPostsList from './UserPostList'

interface Props {
   params: { username: string }
}

export default async function UserPostsPage({ params }: Props) {
   const storeCookies = cookies()
   const user = await getUserByUsername(params.username, storeCookies)
   const postsData = await getPostsByAuthorId(user.id, storeCookies)

   return <UserPostsList initialPostsData={postsData} user={user} />
}
