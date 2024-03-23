'use client'
import Link from 'next/link'
import UsersSkeleton from '~/components/skeletons/UsersSkeleton'
import Button from '~/components/ui/Button'
import Error from '~/components/ui/Error'
import UserItem from '~/components/ui/UserItem'
import WidgetLayout from '~/components/widgets/WidgetLayout'
import useAuth from '~/hooks/useAuth'
import { useGetFollowersQuery } from '~/services/usersApi'
import { extractErrorMessage } from '~/utils/error'

export default function Followers() {
    const { user } = useAuth()
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
