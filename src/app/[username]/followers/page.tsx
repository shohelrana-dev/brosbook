"use client"
import { useGetFollowersQuery, useGetUserByUsernameQuery } from "@services/usersApi"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { User } from "@interfaces/user.interfaces"
import UserItem from "@components/global/UserItem"
import InfiniteScroll from "react-infinite-scroller"
import UsersSkeleton from "@components/skeletons/UsersSkeleton"

interface Props {
    params: { username: string }
}

export default function FollowersPage( { params }: Props ){
    //hooks
    const { data: user } = useGetUserByUsernameQuery( params.username )
    const {
              isLoading,
              isFetching,
              items: followers,
              loadMore,
              hasMore
          }              = useGetInfiniteListQuery<User>( useGetFollowersQuery, { userId: user?.id! } )

    if( isLoading && followers?.length < 1 ){
        return (
            <div className="bg-white box py-3">
                <UsersSkeleton/>
            </div>
        )
    }

    return (
        <>
            <InfiniteScroll
                loadMore={ loadMore }
                hasMore={ hasMore }
                loader={ <UsersSkeleton/> }
            >
                { followers.map( ( user: User ) => (
                    <div className="bg-white p-3 pb-1">
                        <UserItem user={ user } key={ user.id }/>
                    </div>
                ) ) }
            </InfiniteScroll>

            { ( ! isLoading && ! isFetching && followers?.length < 1 ) ? (
                <p className="box text-center py-6">{ user?.fullName }'s haven't follower.</p>
            ) : null }
        </>
    )
}