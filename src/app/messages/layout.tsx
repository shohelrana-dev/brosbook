'use client'
import { useParams } from 'next/navigation'
import { PropsWithChildren } from 'react'
import Loader from '~/components/global/Loader'
import Conversations from '~/components/messages/Conversations'
import ParticipantInfo from '~/components/messages/ParticipantInfo'
import useMediaQuery from '~/hooks/useMediaQuery'
import useMount from '~/hooks/useMount'

export default function Layout({ children }: PropsWithChildren) {
	const isScreenLarge = useMediaQuery('(min-width: 1024px)')
	const { conversationId } = useParams<{ conversationId: string }>()
	const isMounted = useMount()

	if (!isMounted) {
		return (
			<div className='flex justify-center mt-10'>
				<Loader />
			</div>
		)
	} else if (isScreenLarge && conversationId) {
		//chat page
		return (
			<div className='h-screen-content overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] xl:grid-cols-[1fr_3fr_1fr]'>
				<div className='hidden lg:block'>
					<Conversations />
				</div>

				<div className='border-0 border-x-2 border-gray-200'>{children}</div>

				<div className='hidden lg:block mx-2 my-3'>
					<ParticipantInfo />
				</div>
			</div>
		)
	} else if (isScreenLarge) {
		//conversations page
		return (
			<div className='grid grid-cols-1 md:grid-cols-[1fr_3fr]  xl:grid-cols-[1fr_4fr]'>
				<div>{children}</div>

				<div className='hidden md:block pl-4 py-6 border-l-2 border-gray-200'>
					<h3 className='text-2xl font-bold'>Select a message</h3>
					<p>
						Choose from your existing conversations, start a new one, or just keep swimming.
					</p>
				</div>
			</div>
		)
	}

	//page 'without layout'
	return children
}
