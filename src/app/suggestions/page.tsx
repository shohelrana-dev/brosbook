"use client"
import { useGetSuggestedUsersQuery } from "@services/usersApi"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import Loading from "@components/common/Loading"
import { User } from "@interfaces/user.interfaces"
import FollowUser from "@components/common/FollowUser"
import InfiniteScroll from "react-infinite-scroll-component"
import SidebarLayout from "@components/common/SidebarLayout"

export default function Suggestions(){
    //hooks
    const {
              isLoading,
              items: users,
              loadMoreItem,
              hasMoreItem
          } = useGetInfiniteListQuery<User>( useGetSuggestedUsersQuery )

    const endMessage = users?.length > 0 ? 'No more suggestions' : 'You have no suggestion.'

    return (
        <>
            <div className="bg-white p-3 pt-4">
                <h2 className="text-lg md:text-xl font-bold mb-4">Suggested for you</h2>
                { ( ! users && isLoading ) ? <Loading/> : null }

                <InfiniteScroll
                    next={ loadMoreItem }
                    hasMore={ hasMoreItem }
                    loader={ <Loading/> }
                    dataLength={ users?.length }
                    endMessage={ <p className="box text-center mt-5 py-10">{ endMessage }</p> }
                >
                    { users.map( ( user: User ) => (
                        <div className="pb-1">
                            <FollowUser user={ user } key={ user.id }/>
                        </div>
                    ) ) }
                </InfiniteScroll>
            </div>
        </>
    )
}