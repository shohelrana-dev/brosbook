import { ComponentProps } from 'react'
import { useDebounce } from 'use-debounce'
import UserItem from '~/components/global/UserItem'
import UsersSkeleton from '~/components/skeletons/UsersSkeleton'
import { User } from '~/interfaces/user.interfaces'
import { extractErrorMessage } from '~/lib/error'
import { cn } from '~/lib/utils'
import { useSearchUsersQuery } from '~/services/usersApi'
import Error from './Error'

interface Props extends ComponentProps<'div'> {
    searchText: string
    onUserClick?: (user: User) => void
    hideFollowButton?: boolean
    disablePopupCard?: boolean
}

export default function SearchUserList(props: Props) {
    const { onUserClick, searchText, hideFollowButton, disablePopupCard, className, ...rest } = props
    const [dSearchText] = useDebounce<string>(searchText, 600)
    const { data, isFetching, isLoading, isSuccess, isError, error } = useSearchUsersQuery({
        q: dSearchText,
        page: 1,
    })

    const users = data?.items || []

    let content = null
    if (isLoading || isFetching) {
        content = (
            <div className='px-2'>
                <UsersSkeleton count={3} />
            </div>
        )
    } else if (!dSearchText) {
        content = <p className='text-gray-800 p-3'>Try searching for people, topics.</p>
    } else if (isError) {
        content = <Error message={extractErrorMessage(error)!} />
    } else if (isSuccess && users.length < 1) {
        content = <p className='text-gray-800 p-3'>No results found.</p>
    } else if (users && users.length > 0) {
        content = users.map((user) => (
            <div
                key={user.id}
                onClick={() => onUserClick && onUserClick(user)}
                className={cn(
                    'p-3',
                    onUserClick && 'cursor-pointer hover:bg-gray-100 max-h-[70px] duration-200'
                )}
            >
                <UserItem
                    user={user}
                    className={cn('mb-0', onUserClick && 'pointer-events-none')}
                    hideFollowButton={hideFollowButton}
                    disablePopupCard={disablePopupCard}
                />
            </div>
        ))
    }

    return (
        <div className={cn('w-full min-w-72 max-h-130 overflow-y-auto', className)} {...rest}>
            {content}
        </div>
    )
}
