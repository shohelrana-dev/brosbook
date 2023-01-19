import React from 'react'
import { User } from "@interfaces/user.interfaces"
import { useGetSuggestedUsersQuery } from "@services/usersApi"
import Loading from "@components/common/Loading"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import FollowUser from "@components/common/FollowUser"
import Link from "next/link"
import ButtonGray from "@components/common/ButtonGray"

function SuggestedPeople(){
    const {
              isLoading,
              items: users,
              hasMoreItem
          } = useGetInfiniteListQuery<User>( useGetSuggestedUsersQuery )

    return (
        <>
            <h2 className="text-xl font-medium mb-5">Suggested People</h2>

            { isLoading ? <Loading size={ 30 }/> : null }

            { users.length > 0 ? users.map( ( user: User ) => (
                <FollowUser user={ user } key={user.id}/>
            ) ) : null }

            { hasMoreItem ? (
                <Link href="/suggestions">
                    <ButtonGray>
                        Show More
                    </ButtonGray>
                </Link>
            ) : null }
        </>
    )
}

export default SuggestedPeople