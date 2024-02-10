'use client'
import Link from 'next/link'
import UsersSkeleton from '~/components/skeletons/UsersSkeleton'
import Button from '~/components/ui/Button'
import Error from '~/components/ui/Error'
import UserItem from '~/components/ui/UserItem'
import WidgetLayout from '~/components/widgets/WidgetLayout'
import useAuth from '~/hooks/useAuth'
import { User } from '~/interfaces/user.interfaces'
import { useGetSuggestedUsersQuery } from '~/services/usersApi'
import { getErrorData } from '~/utils/error'

export default function SuggestedPeople() {
   const { isAuthenticated } = useAuth()
   const suggestedUsersQuery = useGetSuggestedUsersQuery({ page: 1, limit: 6 })

   const { isError, isLoading, isSuccess, error } = suggestedUsersQuery
   const { items: users, nextPage } = suggestedUsersQuery?.data || {}
   const { message } = getErrorData(error) || {}

   if (!isAuthenticated) return null

   //decide content
   let content = null
   if (isLoading) {
      content = <UsersSkeleton count={2} />
   } else if (isError) {
      content = <Error message={message} />
   } else if (isSuccess && users && users.length === 0) {
      content = <p>No suggestions</p>
   } else if (isSuccess && users && users.length > 0) {
      content = users.map((user: User) => <UserItem user={user} key={user.id} />)
   }

   return (
      <WidgetLayout title="Suggestions for you">
         {content}

         {!!nextPage && (
            <Button as={Link} href="/suggestions">
               See More
            </Button>
         )}
      </WidgetLayout>
   )
}
