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

export default function SuggestedPeople(){
    const { isAuthenticated } = useAuthState()
    const {
              isLoading,
              items: users,
              hasMore,
              isSuccess
          }                   = useGetInfiniteListQuery<User>( useGetSuggestedUsersQuery )

    if( ! isAuthenticated ) return null

    //decide render content
    let content = null
    if( isSuccess && users.length > 0 ){
        content = <>
            { users.length > 0 ? users.map( ( user: User ) => (
                <UserItem user={ user } key={ user.id }/>
            ) ) : null }

            { hasMore ? (
                <Link href="/suggestions">
                    <ButtonGray>
                        Show More
                    </ButtonGray>
                </Link>
            ) : null }
        </>
    } else if( isSuccess && users.length === 0 ){
        content = <p>No suggestions</p>
    } else if( isLoading ){
        content = <UsersSkeleton/>
    }

    return (
        <div className="box p-5">
            <h2 className="text-xl font-medium mb-5">Suggested People</h2>
            { content }
        </div>
    )
}