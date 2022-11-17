"use client"
import useInfiniteScroll from "react-infinite-scroll-hook"
import {useGetFollowersQuery, useGetUserByUsernameQuery} from "@services/usersApi"
import {useGetInfiniteListQuery} from "@hooks/useGetInfiniteListQuery"
import Loading from "@components/common/Loading"
import {User} from "@interfaces/user.interfaces"
import FollowUser from "@components/common/FollowUser"

interface Props {
    params: { username: string }
}

export default function FollowersPage(props: Props) {
    //hooks
    const {data: user} = useGetUserByUsernameQuery(props.params.username)
    const {
        isLoading,
        items: followers,
        loadMoreItem,
        hasMoreItem
    } = useGetInfiniteListQuery<User>(useGetFollowersQuery, {userId: user?.id!})

    const [scrollBottomRef] = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: hasMoreItem,
        onLoadMore: loadMoreItem
    })

    return (
        <>
            {(followers && followers.length > 0) ? followers.map(user => (
                <FollowUser user={user} key={user.id}/>
            )) : null}

            {hasMoreItem ? <div ref={scrollBottomRef}><Loading/></div> : null}

            {!isLoading && followers.length < 1 ? (
                <p className="box text-center py-10">You have no follower</p>
            ) : null}

            {(!isLoading && followers.length > 1 && hasMoreItem) ? (
                <p className="box text-center py-10">No more followers</p>
            ) : null}
        </>
    )
}