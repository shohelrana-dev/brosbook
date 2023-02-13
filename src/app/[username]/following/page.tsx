"use client"
import { useGetFollowingsQuery, useGetUserByUsernameQuery } from "@services/usersApi"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import Loading from "@components/global/Loading"
import { User } from "@interfaces/user.interfaces"
import UserList from "@components/global/UserList"
import InfiniteScroll from "react-infinite-scroller"

interface Props {
    params: { username: string }
}

export default function FollowingPage( { params }: Props ){
    //hooks
    const { data: user } = useGetUserByUsernameQuery( params.username )
    const {
              isLoading,
              isFetching,
              items: followings,
              loadMoreItem,
              hasMoreItem
          }              = useGetInfiniteListQuery<User>( useGetFollowingsQuery, { userId: user?.id! } )

    if( isLoading && followings?.length < 1 ){
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
                { followings.map( ( user: User ) => (
                    <div className="bg-white p-3 pb-1">
                        <UserList user={ user } key={ user.id }/>
                    </div>
                ) ) }
            </InfiniteScroll>

            { ( ! isLoading && ! isFetching && followings?.length < 1 ) ? (
                <p className="box text-center py-6">{ user?.fullName }'s haven't following.</p>
            ) : null }
        </>
    )
}