'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import TextOverflow from 'react-text-overflow'
import Avatar from '~/components/global/Avatar'
import Error from '~/components/global/Error'
import FollowButton from '~/components/global/FollowButton'
import Loader from '~/components/global/Loader'
import useMediaQuery from '~/hooks/useMediaQuery'
import useSession from '~/hooks/useSession'
import { User } from '~/interfaces/user.interfaces'
import { extractErrorMessage } from '~/lib/error'
import { useGetSuggestedUsersQuery } from '~/services/usersApi'

export default function SlidesSuggestions() {
    const { isLoggedIn } = useSession()
    const isMobileDevice = useMediaQuery('(max-width: 768px)')
    const suggestedUsersQuery = useGetSuggestedUsersQuery(
        { page: 1, limit: 12 },
        { skip: !isMobileDevice || !isLoggedIn }
    )
    const [isTimeUp, setIsTimeUp] = useState(false)

    const { data, isError, isLoading, isSuccess, error } = suggestedUsersQuery
    const { items: users } = data || {}

    useEffect(() => {
        const timerId = setTimeout(() => {
            setIsTimeUp(true)
        }, 10000)

        return () => clearTimeout(timerId)
    }, [])

    if (!isLoggedIn || !isMobileDevice || !isTimeUp) return null

    const responsive = {
        tablet: {
            breakpoint: { min: 400, max: 4000 },
            items: 3,
        },
        mobile: {
            breakpoint: { max: 400, min: 0 },
            items: 2,
        },
    }

    //decide render content
    let content = null
    if (isLoading) {
        content = <Loader />
    } else if (isError) {
        content = <Error message={extractErrorMessage(error)} />
    } else if (isSuccess && users && users.length === 0) {
        content = <p>No suggestions</p>
    } else if (isSuccess && users && users.length > 0) {
        content = (
            <Carousel
                centerMode
                arrows
                responsive={responsive}
                className='[&_.react-multiple-carousel\_\_arrow]:min-w-8 [&_.react-multiple-carousel\_\_arrow]:min-h-8 [&_.react-multiple-carousel\_\_arrow:before]:text-sm'
            >
                {users.map((user: User) => (
                    <div className='card p-3 mb-2' key={user.id}>
                        <Link href={`/${user.username}`} className='flex flex-col items-center'>
                            <Avatar src={user.avatar.url} />
                            <h4 className='font-bold text-gray-900 text-sm mt-2'>
                                <TextOverflow text={user.fullName} />
                            </h4>
                            <p className='text-gray-700 mb-3 text-xs'>@{user.username}</p>
                        </Link>
                        <FollowButton user={user} fullWidth />
                    </div>
                ))}
            </Carousel>
        )
    }

    return (
        <motion.div
            className='mt-1 mb-2 p-1'
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
            {content}
        </motion.div>
    )
}
