import React from 'react'
import { User } from "@interfaces/user.interfaces"
import { useSearchUsersQuery } from "@services/usersApi"
import classNames from "classnames"
import UserItem from "@components/global/UserItem"
import UsersSkeleton from "@components/skeletons/UsersSkeleton"

interface Props {
    onUserClick: ( user: User ) => void
    searchText: string
    wrapperClassname?: string
}

export default function SearchUserList( { onUserClick, searchText, wrapperClassname }: Props ){
    const { data, isLoading, isSuccess } = useSearchUsersQuery( { q: searchText, page: 1 }, { skip: ! searchText } )

    const users = data?.items || []

    return (
        <div
            className={ classNames( "box bg-white max-w-5xl p-3 absolute top-full left-0 w-max h-fit overflow-y-auto mt-1 bg-white drop-shadow-2xl max-h-[80vh] overflow-y-auto min-w-[250px]", wrapperClassname ) }>
            { isLoading ? <UsersSkeleton count={ 2 }/> : null }

            { ( users && users.length > 0 ) ? users.map( user => (
                <div key={ user.id } onClick={ () => onUserClick( user ) } className="cursor-pointer">
                    <UserItem user={ user } className="pointer-events-none" hideFollowButton={ true }/>
                </div>
            ) ) : null }

            { ( ! searchText ) ? (
                <p className="text-gray-800 pb-4">
                    Try searching for people, topics.
                </p>
            ) : null }

            { ( isSuccess && users.length < 1 ) ? (
                <p className="text-gray-800 pb-4">
                    No results found.
                </p>
            ) : null }
        </div>
    )
}