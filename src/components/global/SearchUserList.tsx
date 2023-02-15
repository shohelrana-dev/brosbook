import React from 'react'
import Loading from "@components/global/Loading"
import { User } from "@interfaces/user.interfaces"
import Avatar from "@components/global/Avatar"
import { useSearchUsersQuery } from "@services/usersApi"
import classNames from "classnames"

interface Props {
    onUserClick: ( user: User ) => void
    searchKey: string
    wrapperClassname?: string
}

export default function SearchUserList( { onUserClick, searchKey, wrapperClassname }: Props ){
    const { data, isLoading, isSuccess } = useSearchUsersQuery( { key: searchKey, page: 1 }, { skip: ! searchKey } )

    const users = data?.items || []

    return (
        <div
            className={ classNames( "box bg-white max-w-5xl p-3 absolute z-10 top-full left-0 w-max h-fit overflow-y-auto mt-1 bg-white drop-shadow-2xl", wrapperClassname ) }>
            { isLoading ? <Loading/> : null }

            { ( users && users.length > 0 ) ? users.map( user => (
                <div
                    key={ user.id }
                    onClick={ () => onUserClick( user ) }
                    className="p-3 mb-2 flex bg-white w-full cursor-pointer gap-3"
                >
                    <Avatar
                        src={ user.avatar.url }
                        online={ user.active === 1 }
                        alt={ user.fullName }
                        size="medium"

                    />
                    <div className="block">
                        <h4 className="text-base">
                            { user.fullName }
                        </h4>
                        <div className="text-sm text-gray-700">{ `@${ user.username }` }</div>
                        <div className="text-gray-700">{ user.profile?.bio }</div>
                    </div>
                </div>
            ) ) : null }

            { ( ! searchKey ) ? (
                <p className="text-gray-800 pb-4">
                    Try searching for people, topics, or keywords
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