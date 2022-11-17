"use client"
import useInfiniteScroll from "react-infinite-scroll-hook"
import {useGetFollowingQuery, useGetUserByUsernameQuery} from "@services/usersApi"
import {useGetInfiniteListQuery} from "@hooks/useGetInfiniteListQuery"
import Loading from "@components/common/Loading"
import {User} from "@interfaces/user.interfaces"
import FollowUser from "@components/common/FollowUser"

interface Props {
    params: { username: string }
}

export default function FollowingPage(props: Props) {
    //hooks
    const {data: user} = useGetUserByUsernameQuery(props.params.username)
    const {
        isLoading,
        items: followings,
        loadMoreItem,
        hasMoreItem
    } = useGetInfiniteListQuery<User>(useGetFollowingQuery, {userId: user?.id!})

    const [scrollBottomRef] = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: hasMoreItem,
        onLoadMore: loadMoreItem
    })

    return (
        <>
            {(followings && followings.length > 0) ? followings.map(user => (
                <FollowUser user={user} key={user.id}/>
            )) : null}

            {hasMoreItem ? <div ref={scrollBottomRef}><Loading/></div> : null}

            {!isLoading && followings.length < 1 ? (
                <p className="box text-center py-10">You haven't followed yet</p>
            ) : null}

            {(!isLoading && followings.length > 1 && hasMoreItem) ? (
                <p className="box text-center py-10">No more following</p>
            ) : null}
        </>
    )
}