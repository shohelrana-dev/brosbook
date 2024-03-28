'use client'
import Link from 'next/link'
import Button from '~/components/global/Button'
import Error from '~/components/global/Error'
import UserItem from '~/components/global/UserItem'
import UsersSkeleton from '~/components/skeletons/UsersSkeleton'
import WidgetLayout from '~/components/widgets/WidgetLayout'
import useSession from '~/hooks/useSession'
import { useGetFollowersQuery } from '~/services/usersApi'
import { extractErrorMessage } from '~/utils/error'

export default function Followers() {
    const { user } = useSession()
    const followersQuery = useGetFollowersQuery({ userId: user?.id!, page: 1 }, { skip: !user?.id })

    const { isError, isLoading, isSuccess, error } = followersQuery
    const { items: users, nextPage } = followersQuery.data || {}

    //decide content
    let content = null
    if (isLoading) {
        content = <UsersSkeleton count={2} />
    } else if (isError) {
        content = <Error message={extractErrorMessage(error)} />
    } else if (isSuccess && users && users.length === 0) {
        content = <p>No one following yet.</p>
    } else if (isSuccess && users && users.length > 0) {
        content = users.map((user) => <UserItem user={user} key={user.id} />)
    }

    return (
        <WidgetLayout title="Who's follownig">
            {content}

            {!!nextPage && (
                <Button as={Link} href={`/${user?.username}/followers`}>
                    See More
                </Button>
            )}
        </WidgetLayout>
    )
}
