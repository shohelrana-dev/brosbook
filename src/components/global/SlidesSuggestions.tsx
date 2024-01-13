'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import TextOverflow from 'react-text-overflow'
import { Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import Avatar from '~/components/global/Avatar'
import Error from '~/components/global/Error'
import FollowButton from '~/components/global/FollowButton'
import Loader from '~/components/global/Loader'
import useAuth from '~/hooks/useAuth'
import useMediaQuery from '~/hooks/useMediaQuery'
import { ErrorResponse } from '~/interfaces/index.interfaces'
import { User } from '~/interfaces/user.interfaces'
import { useGetSuggestedUsersQuery } from '~/services/usersApi'

export default function SlidesSuggestions() {
	const { isAuthenticated } = useAuth()
	const suggestedUsersQuery = useGetSuggestedUsersQuery({ page: 1, limit: 12 })
	const isMobileDevice = useMediaQuery('(max-width: 768px)')
	const [isTimeUp, setIsTimeUp] = useState(false)

	const { isError, isLoading, isSuccess } = suggestedUsersQuery
	const { items: users = [] } = suggestedUsersQuery?.data || {}
	const error = (suggestedUsersQuery.error || {}) as ErrorResponse

	useEffect(() => {
		setTimeout(() => {
			setIsTimeUp(true)
		}, 10000)
	}, [])

	if (!isAuthenticated || !isMobileDevice || !isTimeUp) return null

	//decide render content
	let content = null
	if (isLoading) {
		content = <Loader />
	} else if (isSuccess && users.length === 0) {
		content = <p>No suggestions</p>
	} else if (isError) {
		content = <Error message={error?.data?.message} />
	} else if (isSuccess && users.length > 0) {
		content = users.map((user: User) => (
			<SwiperSlide key={user.id}>
				<div className='flex flex-wrap items-center justify-center flex flex-col card p-3'>
					<Link
						href={`/${user.username}`}
						className='flex flex-wrap items-center justify-center flex flex-col'
					>
						<Avatar src={user.avatar.url} />
						<h4 className='font-bold text-gray-900 text-sm mt-2'>
							<TextOverflow text={user.fullName} />
						</h4>
						<p className='text-gray-700 mb-3 text-xs'>@{user.username}</p>
					</Link>
					<FollowButton user={user} />
				</div>
			</SwiperSlide>
		))
	}

	return (
		<motion.div
			className='mt-1 mb-2 p-2'
			initial={{
				opacity: 0.2,
			}}
			animate={{
				opacity: 1,
			}}
		>
			<div className='flex flex-wrap justify-between items-center'>
				<h3 className='text-gray-900 text-lg font-bold mb-2'>Suggested for you</h3>
				<Link href='/suggestions' className='text-blue-600 hover:font-bold'>
					See all
				</Link>
			</div>
			<Swiper
				slidesPerView={3}
				spaceBetween={10}
				navigation={true}
				modules={[Pagination, Navigation]}
			>
				{content}
			</Swiper>
		</motion.div>
	)
}
