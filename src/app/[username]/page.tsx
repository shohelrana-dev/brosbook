import { getPostsByAuthorId, getUserByUsername } from '@/services/index'
import UserPostsList from 'app/[username]/UserPostList'
import { cookies } from 'next/headers'

interface Props {
	params: { username: string }
}

export default async function UserPostsPage({ params }: Props) {
	const storeCookies = cookies()
	const user = await getUserByUsername(params.username, storeCookies)
	const postsData = await getPostsByAuthorId(user.id, storeCookies)
	
	return <UserPostsList initialPostsData={postsData} user={user} />
}
