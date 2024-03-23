import { getPostsByAuthorId, getUserByUsername } from '~/services/index'
import UserPostsList from './UserPostList'

interface Props {
    params: { username: string }
}

export default async function UserPostsPage({ params }: Props) {
    const user = await getUserByUsername(params.username)
    const postsData = await getPostsByAuthorId(user.id)

    return <UserPostsList initialPostsData={postsData} user={user} />
}
