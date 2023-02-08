"use client"
import { useGetFollowersQuery, useGetUserByUsernameQuery } from "@services/usersApi"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import Loading from "@components/common/Loading"
import { User } from "@interfaces/user.interfaces"
import UserList from "@components/common/UserList"
import InfiniteScroll from "react-infinite-scroller"

interface Props {
    params: { username: string }
}

export default function FollowersPage( props: Props ){
    //hooks
    const { data: user } = useGetUserByUsernameQuery( props.params.username )
    const {
              isLoading,
              isFetching,
              items: followers,
              loadMoreItem,
              hasMoreItem
          }              = useGetInfiniteListQuery<User>( useGetFollowersQuery, { userId: user?.id! } )

    if( isLoading && followers?.length < 1 ){
        return (
            <div className="box text-center py-3">
                <Loading size={ 45 }/>
            </div>
        )
    }

    return (
        <>
            <InfiniteScroll
                loadMore={ loadMoreItem }
                hasMore={ hasMoreItem }
                loader={ <Loading/> }
            >
                { followers.map( ( user: User ) => (
                    <div className="bg-white p-3 pb-1">
                        <UserList user={ user } key={ user.id }/>
                    </div>
                ) ) }
            </InfiniteScroll>

            { ( ! isLoading && ! isFetching && followers?.length < 1 ) ? (
                <p className="box text-center py-6">{ user?.fullName }'s haven't follower.</p>
            ) : null }
        </>
    )
}