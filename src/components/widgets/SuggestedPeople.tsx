import React from 'react'
import { User } from "@interfaces/user.interfaces"
import { useGetSuggestedUsersQuery } from "@services/usersApi"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import UserItem from "@components/global/UserItem"
import Link from "next/link"
import ButtonGray from "@components/global/ButtonGray"
import UsersLoader from "@components/loaders/UsersLoader"
import useAuthState from "@hooks/useAuthState"

export default function SuggestedPeople(){
    const { isChecked, isAuthenticated } = useAuthState()
    const {
              isLoading,
              items: users,
              hasMoreItem,
              isSuccess
          }                              = useGetInfiniteListQuery<User>( useGetSuggestedUsersQuery )

    if( ! isChecked || isLoading ){
        return (
            <div className="box p-5">
                <h2 className="text-xl font-medium mb-5">Suggested People</h2>
                <UsersLoader/>
            </div>
        )
    }

    if( ! isAuthenticated ) return null

    return (
        <div className="box p-5">
            <h2 className="text-xl font-medium mb-5">Suggested People</h2>

            { users.length > 0 ? users.map( ( user: User ) => (
                <UserItem user={ user } key={ user.id }/>
            ) ) : null }

            { hasMoreItem ? (
                <Link href="/suggestions">
                    <ButtonGray>
                        Show More
                    </ButtonGray>
                </Link>
            ) : null }

            { isSuccess && users.length < 1 ? (
                <p>No suggestions</p>
            ) : null }
        </div>
    )
}