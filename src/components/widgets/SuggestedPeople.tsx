"use client"
import React from 'react'
import { User } from "@interfaces/user.interfaces"
import { useGetSuggestedUsersQuery } from "@services/usersApi"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import UserItem from "@components/global/UserItem"
import Link from "next/link"
import ButtonGray from "@components/global/ButtonGray"
import UsersLoader from "@components/loaders/UsersLoader"

function SuggestedPeople(){
    const {
              isLoading,
              items: users,
              hasMoreItem
          } = useGetInfiniteListQuery<User>( useGetSuggestedUsersQuery )

    if( ! isLoading && users?.length < 1 ){
        return null
    }

    return (
        <div className="box p-5">
            <h2 className="text-xl font-medium mb-5">Suggested People</h2>

            { isLoading ? <UsersLoader/> : null }

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
        </div>
    )
}

export default SuggestedPeople