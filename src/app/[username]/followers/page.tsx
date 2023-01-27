"use client"
import { useGetFollowersQuery, useGetUserByUsernameQuery } from "@services/usersApi"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import Loading from "@components/common/Loading"
import { User } from "@interfaces/user.interfaces"
import FollowUser from "@components/common/FollowUser"
import InfiniteScroll from "react-infinite-scroller"

interface Props {
    params: { username: string }
}

export default function FollowersPage( props: Props ){
    //hooks
    const { data: user } = useGetUserByUsernameQuery( props.params.username )
    const {
              isLoading,
              items: followers,
              loadMoreItem,
              hasMoreItem
          }              = useGetInfiniteListQuery<User>( useGetFollowersQuery, { userId: user?.id! } )

    return (
        <>
            { ( ! followers && isLoading ) ? <Loading/> : null }

            <InfiniteScroll
                loadMore={ loadMoreItem }
                hasMore={ hasMoreItem }
                loader={ <Loading/> }
            >
                { followers.map( ( user: User ) => (
                    <div className="bg-white p-3 pb-1">
                        <FollowUser user={ user } key={ user.id }/>
                    </div>
                ) ) }
            </InfiniteScroll>

            { ( ! isLoading && followers?.length < 1 ) ? (
                <p className="box text-center mt-5 py-10">{ user?.fullName }'s haven\'t follower.</p>
            ) : null }
        </>
    )
}