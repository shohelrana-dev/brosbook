"use client"
import { useGetSuggestedUsersQuery } from "@services/usersApi"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import Loading from "@components/global/Loading"
import { User } from "@interfaces/user.interfaces"
import UserItem from "@components/global/UserItem"
import InfiniteScroll from "react-infinite-scroller"

export default function SuggestionsPage(){
    //hooks
    const {
              isLoading,
              items: users,
              loadMoreItem,
              hasMoreItem,
              isSuccess
          } = useGetInfiniteListQuery<User>( useGetSuggestedUsersQuery )

    return (
        <div className="bg-white p-3 pt-4">
            <h2 className="text-lg md:text-xl font-bold mb-4">Suggested for you</h2>
            { isLoading ? <Loading size={50}/> : null }

            <InfiniteScroll
                loadMore={ loadMoreItem }
                hasMore={ hasMoreItem }
                loader={ <Loading/> }
            >
                { users.map( ( user: User ) => (
                    <div className="pb-1">
                        <UserItem user={ user } key={ user.id }/>
                    </div>
                ) ) }
            </InfiniteScroll>

            { ( isSuccess && users?.length < 1 ) ? (
                <p className="box text-center py-6">You have no suggestion.</p>
            ) : null }
        </div>
    )
}