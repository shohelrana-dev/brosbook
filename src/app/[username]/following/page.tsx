"use client"
import { useGetFollowingsQuery, useGetUserByUsernameQuery } from "@services/usersApi"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import Loading from "@components/common/Loading"
import { User } from "@interfaces/user.interfaces"
import FollowUser from "@components/common/FollowUser"
import InfiniteScroll from "react-infinite-scroll-component"

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

    const endMessage = followings?.length > 0 ? 'No more followers' : 'You have no follower.'

    return (
        <>
            { ( ! followings && isLoading ) ? <Loading/> : null }

            <InfiniteScroll
                next={ loadMoreItem }
                hasMore={ hasMoreItem }
                loader={ <Loading/> }
                dataLength={ followings?.length }
                endMessage={ <p className="box text-center mt-5 py-10">{ endMessage }</p> }
            >
                { followings.map( ( user: User ) => (
                    <div className="bg-white p-3 pb-1">
                        <FollowUser user={ user } key={ user.id }/>
                    </div>
                ) ) }
            </InfiniteScroll>
        </>
    )
}