import React, { useState }  from 'react'
import { useRouter }        from "next/router"
import { CircularProgress } from "@mui/material"
import useInfiniteScroll    from "react-infinite-scroll-hook"

import ProfileLayout         from "@components/layouts/ProfileLayout"
import FollowUser            from "@components/common/FollowUser"
import { PaginateMeta }      from "@interfaces/index.interfaces"
import { useFollowersQuery } from "@services/usersApi"

export default function Followers(){
    //hooks
    const router        = useRouter()
    const username      = router.query.username as string
    const { isLoading, data } = useFollowersQuery( { username } )

    const [meta, setMeta] = useState<PaginateMeta>( {} as PaginateMeta )

    const [scrollBottomRef] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: !! meta?.nextPage,
        onLoadMore: () => ''
    } )

    return (
        <ProfileLayout>
            <>
                { data?.followers && data?.followers.map( user => (
                    <FollowUser user={ user } key={ user.id }/>
                ) ) }

                { meta?.nextPage && (
                    <div className="flex justify-center min-h-[300px] items-center" ref={ scrollBottomRef }>
                        <CircularProgress/>
                    </div>
                ) }

                { ! isLoading && data?.followers.length < 1 && (
                    <p className="box text-center py-10">You have no follower</p>
                ) }

                { ! isLoading && data?.followers.length > 1 && ! meta.nextPage && (
                    <p className="box text-center py-10">No more followers</p>
                ) }
            </>
        </ProfileLayout>
    )
}
