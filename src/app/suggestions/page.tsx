"use client"
import { useGetSuggestedUsersQuery } from "@services/usersApi"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import Loading from "@components/common/Loading"
import { User } from "@interfaces/user.interfaces"
import FollowUser from "@components/common/FollowUser"
import InfiniteScroll from "react-infinite-scroller"

export default function Suggestions(){
    //hooks
    const {
              isLoading,
              items: users,
              loadMoreItem,
              hasMoreItem
          } = useGetInfiniteListQuery<User>( useGetSuggestedUsersQuery )

    return (
        <>
            <div className="bg-white p-3 pt-4">
                <h2 className="text-lg md:text-xl font-bold mb-4">Suggested for you</h2>
                { ( ! users && isLoading ) ? <Loading/> : null }

                <InfiniteScroll
                    loadMore={ loadMoreItem }
                    hasMore={ hasMoreItem }
                    loader={ <Loading/> }
                >
                    { users.map( ( user: User ) => (
                        <div className="pb-1">
                            <FollowUser user={ user } key={ user.id }/>
                        </div>
                    ) ) }
                </InfiniteScroll>

                { ( ! isLoading && users?.length < 1 ) ? (
                    <p className="box text-center mt-5 py-10">You have no suggestion.</p>
                ) : null }
            </div>
        </>
    )
}