"use client"
import React from 'react'
import { User } from "@interfaces/user.interfaces"
import { useGetSuggestedUsersQuery } from "@services/usersApi"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import UserItem from "@components/global/UserItem"
import Link from "next/link"
import ButtonGray from "@components/global/ButtonGray"
import UsersSkeleton from "@components/skeletons/UsersSkeleton"
import useAuthState from "@hooks/useAuthState"
import Error from "@components/global/Error"

export default function SuggestedPeople(){
    const { isAuthenticated } = useAuthState()
    const {
              isLoading,
              items: users,
              hasMore,
              isSuccess,
              isError,
              error
          }                   = useGetInfiniteListQuery<User>( useGetSuggestedUsersQuery )

    if( ! isAuthenticated ) return null

    //decide render content
    let content = null
    if( isLoading ){
        content = <UsersSkeleton/>
    } else if( isSuccess && users.length === 0 ){
        content = <p>No suggestions</p>
    } else if( isError ){
        content = <Error message={ error?.data?.message }/>
    } else if( isSuccess && users.length > 0 ){
        content = users.map( ( user: User ) => (
            <UserItem user={ user } key={ user.id }/>
        ) )
    }

    return (
        <div className="box p-5">
            <h2 className="text-xl font-medium mb-5">Suggested People</h2>
            { content }

            { hasMore ? (
                <Link href="/suggestions">
                    <ButtonGray>
                        Show More
                    </ButtonGray>
                </Link>
            ) : null }
        </div>
    )
}