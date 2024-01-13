'use client'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Error from '~/components/global/Error'
import ImageLightbox from '~/components/global/ImageLightbox'
import Loader from '~/components/global/Loader'
import Transition from '~/components/global/Transition'
import { ErrorResponse } from '~/interfaces/index.interfaces'
import { useGetMediaListQuery, useGetUserByUsernameQuery } from '~/services/usersApi'

interface Props {
	params: { username: string }
}

export default function MediaPage({ params }: Props) {
	const [page, setPage] = useState(1)
	const { data: user } = useGetUserByUsernameQuery(params.username)
	const mediaListQuery = useGetMediaListQuery({ userId: user?.id!, page }, { skip: !user?.id })

	const { data: mediaListData, isLoading, isSuccess, isError } = mediaListQuery || {}
	const { items: mediaList = [], nextPage } = mediaListData || {}
	const error = (mediaListQuery.error as ErrorResponse) || {}

	//decide content
	let content = null
	if (isLoading) {
		content = (
			<div className='py-3'>
				<Loader />
			</div>
		)
	} else if (isSuccess && mediaList.length === 0) {
		content = <p className='text-center py-3'>{user?.fullName} haven&apos;t media.</p>
	} else if (isError) {
		content = <Error message={error?.data?.message} />
	} else if (isSuccess && mediaList.length > 0) {
		content = (
			<Transition>
				<InfiniteScroll
					dataLength={mediaList.length}
					next={() => setPage(nextPage!)}
					hasMore={!!nextPage}
					loader={<Loader />}
				>
					<ImageLightbox imageList={mediaList} width={200} height={200} alt='Media' />
				</InfiniteScroll>
			</Transition>
		)
	}

	return <div className='card'>{content}</div>
}
