import React from 'react'
import { User } from '@interfaces/user.interfaces'
import { useSearchUsersQuery } from '@services/usersApi'
import UserItem from '@components/global/UserItem'
import UsersSkeleton from '@components/skeletons/UsersSkeleton'
import { twJoin, twMerge } from 'tailwind-merge'

interface Props {
    searchText: string
    handleUserClick?: (user: User) => void
    wrapperClassname?: string
    hideFollowButton?: boolean
}

export default function SearchUserList({ handleUserClick, searchText, hideFollowButton, wrapperClassname }: Props) {
    const { data, isLoading, isSuccess } = useSearchUsersQuery({ q: searchText, page: 1 }, { skip: !searchText })

    const users = data?.items || []

    return (
        <div className={twMerge('min-w-72 max-h-130 p-3 overflow-y-auto', wrapperClassname)}>
            {isLoading ? <UsersSkeleton count={3} /> : null}

            {users && users.length > 0
                ? users.map(user => (
                      <div
                          key={user.id}
                          onClick={() => handleUserClick && handleUserClick(user)}
                          className={twJoin(
                              'p-3',
                              handleUserClick && 'cursor-pointer hover:bg-gray-100 max-h-[70px] duration-200'
                          )}
                      >
                          <UserItem
                              user={user}
                              className={twMerge('mb-0', handleUserClick && 'pointer-events-none')}
                              hideFollowButton={hideFollowButton}
                          />
                      </div>
                  ))
                : null}

            {!searchText ? <p className='text-gray-800 p-3 pb-4'>Try searching for people, topics.</p> : null}

            {isSuccess && users.length < 1 ? <p className='text-gray-800 p-3 pb-4'>No results found.</p> : null}
        </div>
    )
}
