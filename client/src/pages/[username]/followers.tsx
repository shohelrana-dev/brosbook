import React, { useState }  from 'react'
import { useRouter }        from "next/router"
import { CircularProgress } from "@mui/material"
import useAsyncEffect       from "use-async-effect"
import useInfiniteScroll    from "react-infinite-scroll-hook"

import ProfileLayout    from "@components/layouts/ProfileLayout"
import FollowUser       from "@components/common/FollowUser"
import { User }         from "@interfaces/user.interfaces"
import api              from "@api/index"
import { PaginateMeta } from "@interfaces/index.interfaces"

export default function Followers() {
    //hooks
    const router                      = useRouter()
    const [ isLoading, setIsLoading ] = useState<boolean>( false )
    const [ followers, setFollowers ] = useState<User[]>( [] )
    const [ meta, setMeta ]           = useState<PaginateMeta>( {} as PaginateMeta )

    const username = router.query.username as string

    useAsyncEffect( () => fetchFollowers(), [ username ] )

    async function fetchFollowers( page: number = 1, postsPerPage: number = 10 ) {
        if ( !username ) return
        setIsLoading( true )

        try {
            const { data } = await api.profile.fetchFollowers( username, page, postsPerPage )
            setFollowers( [ ...followers, ...data.followers ] )
            setMeta( data.meta )
        } catch ( err: any ) {
            console.error( err.response?.data.message )
        } finally {
            setIsLoading( false )
        }
    }

    const [ scrollBottomRef ] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: !!meta?.nextPage,
        onLoadMore: () => fetchFollowers( meta?.nextPage ),
    } )

    return (
        <ProfileLayout>
            <>
                { followers && followers.map( user => (
                    <FollowUser user={ user } key={ user.id }/>
                ) ) }

                { meta?.nextPage && (
                    <div className="flex justify-center min-h-[300px] items-center" ref={ scrollBottomRef }>
                        <CircularProgress/>
                    </div>
                ) }

                { !isLoading && followers.length < 1 && (
                    <p className="box text-center py-10">You have no follower</p>
                ) }

                { !isLoading && followers.length > 1 && !meta.nextPage && (
                    <p className="box text-center py-10">No more followers</p>
                ) }
            </>
        </ProfileLayout>
    )
}
