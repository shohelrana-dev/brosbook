"use client"
import { useGetFollowingsQuery, useGetUserByUsernameQuery } from "@services/usersApi"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import Loading from "@components/common/Loading"
import { User } from "@interfaces/user.interfaces"
import FollowUser from "@components/common/FollowUser"
import InfiniteScroll from "react-infinite-scroller"

interface Props {
    params: { username: string }
}

export default function FollowingPage( props: Props ){
    //hooks
    const { data: user } = useGetUserByUsernameQuery( props.params.username )
    const {
              isLoading,
              items: followings,
              loadMoreItem,
              hasMoreItem
          }              = useGetInfiniteListQuery<User>( useGetFollowingsQuery, { userId: user?.id! } )

    return (
        <>
            { ( ! followings && isLoading ) ? <Loading/> : null }

            <InfiniteScroll
                loadMore={ loadMoreItem }
                hasMore={ hasMoreItem }
                loader={ <Loading/> }
            >
                { followings.map( ( user: User ) => (
                    <div className="bg-white p-3 pb-1">
                        <FollowUser user={ user } key={ user.id }/>
                    </div>
                ) ) }
            </InfiniteScroll>

            { ( ! isLoading && followings?.length < 1 ) ? (
                <p className="box text-center py-6">{ user?.fullName }'s haven't following.</p>
            ) : null }
        </>
    )
}