import React from 'react'
import Loading from "@components/common/Loading"
import { User } from "@interfaces/user.interfaces"
import Avatar from "@components/common/Avatar"

interface Props {
    onUserClick: ( user: User ) => void
    users: User[]
    isLoading: boolean
}

function SearchUserList( { onUserClick, users, isLoading }: Props ){
    return (
        <div className="relative z-20">
            <div
                className="box max-w-5xl p-3 absolute top-full left-0 w-full mt-1 bg-white drop-shadow-2xl">
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
                            <div className="text-sm text-gray-700">{ `@${user.username}` }</div>
                            <div className="text-gray-700">{ user.profile?.bio }</div>
                        </div>
                    </div>
                ) ) : null }

                { ( ! isLoading && users.length < 1 ) ? (
                    <p className="text-gray-800 pb-4">
                        Try searching for people, topics, or keywords
                    </p>
                ) : null }
            </div>
        </div>
    )
}

export default SearchUserList