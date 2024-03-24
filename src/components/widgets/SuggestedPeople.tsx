'use client'
import Link from 'next/link'
import Button from '~/components/global/Button'
import Error from '~/components/global/Error'
import UserItem from '~/components/global/UserItem'
import UsersSkeleton from '~/components/skeletons/UsersSkeleton'
import WidgetLayout from '~/components/widgets/WidgetLayout'
import { User } from '~/interfaces/user.interfaces'
import { useGetSuggestedUsersQuery } from '~/services/usersApi'
import { extractErrorMessage } from '~/utils/error'

export default function SuggestedPeople() {
    const suggestedUsersQuery = useGetSuggestedUsersQuery({ page: 1, limit: 6 })

    const { isError, isLoading, isSuccess, error } = suggestedUsersQuery
    const { items: users, nextPage } = suggestedUsersQuery?.data || {}

    //decide content
    let content = null
    if (isLoading) {
        content = <UsersSkeleton count={2} />
    } else if (isError) {
        content = <Error message={extractErrorMessage(error)} />
    } else if (isSuccess && users && users.length === 0) {
        content = <p>No suggestions</p>
    } else if (isSuccess && users && users.length > 0) {
        content = users.map((user: User) => <UserItem user={user} key={user.id} />)
    }

    return (
        <WidgetLayout title='Suggestions for you'>
            {content}

            {!!nextPage && (
                <Button as={Link} href='/suggestions'>
                    See More
                </Button>
            )}
        </WidgetLayout>
    )
}
