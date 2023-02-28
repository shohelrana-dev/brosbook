"use client"
import { useGetFollowingsQuery, useGetUserByUsernameQuery } from "@services/usersApi"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import Loading from "@components/global/Loading"
import { User } from "@interfaces/user.interfaces"
import UserItem from "@components/global/UserItem"
import InfiniteScroll from "react-infinite-scroller"
import UsersLoader from "@components/loaders/UsersLoader";

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
            <div className="bg-white box py-3">
                <UsersLoader count={2}/>
            </div>
        )
    }

    return (
        <>
            <InfiniteScroll
                loadMore={ loadMoreItem }
                hasMore={ hasMoreItem }
                loader={ <UsersLoader count={ 2 }/> }
            >
                { followings.map( ( user: User ) => (
                    <div className="bg-white p-3 pb-1">
                        <UserItem user={ user } key={ user.id }/>
                    </div>
                ) ) }
            </InfiniteScroll>

            { ( ! isLoading && ! isFetching && followings?.length < 1 ) ? (
                <p className="box text-center py-6">{ user?.fullName }'s haven't following.</p>
            ) : null }
        </>
    )
}