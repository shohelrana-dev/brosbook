import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import MessageItem from '~/components/messages/MessageBox/MessageItem'
import ChatSkeleton from '~/components/skeletons/ChatSkeleton'
import Error from '~/components/ui/Error'
import Loader from '~/components/ui/Loader'
import Transition from '~/components/ui/Transition'
import useAuth from '~/hooks/useAuth'
import { Message } from '~/interfaces/conversation.interfaces'
import { useGetConversationByIdQuery } from '~/services/conversationsApi'
import { useGetMessagesQuery, useSeenMessagesMutation } from '~/services/messagesApi'
import { getErrorData } from '~/utils/error'

export default function MessageList() {
	//hooks
	const { user } = useAuth()
	const { conversationId } = useParams()
	const { data: conversation } = useGetConversationByIdQuery(conversationId as string)
	const messageListRef = useRef<HTMLUListElement>(null)
	const [page, setPage] = useState(1)
	const messagesQuery = useGetMessagesQuery(
		{ conversationId: conversation?.id!, page },
		{ skip: !conversation?.id }
	)
	const [seenMessages] = useSeenMessagesMutation()

	const { isLoading, isSuccess, isError, data: messagesData, error } = messagesQuery
	const { items: messages, nextPage } = messagesData || {}
	const { message: errorMessage } = getErrorData(error) || {}
	const participant = conversation?.user1.id === user?.id ? conversation?.user2 : conversation?.user1
	const lastMessage = messages?.[0]

	useEffect(() => {
		if (lastMessage && !lastMessage?.isMeSender && !lastMessage?.seenAt) {
			seenMessages(conversation?.id!)
		}
	}, [lastMessage, conversation, seenMessages])

	useEffect(() => {
		if (!messageListRef.current || !lastMessage) return

		messageListRef.current.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
		})
	}, [lastMessage])

	//decide content
	let content = null
	if (isLoading) {
		content = <ChatSkeleton />
	} else if (isError) {
		content = <Error message={errorMessage} />
	} else if (isSuccess && messages && messages.length === 0) {
		content = (
			<div className='h-full flex flex-wrap justify-center items-center'>
				<h4 className='text-gray-700 text-lg'>No messages</h4>
			</div>
		)
	} else if (isSuccess && messages && messages.length > 0) {
		content = (
			<Transition id='messages-container' className='flex flex-col-reverse overflow-y-auto'>
				<InfiniteScroll
					next={() => setPage(nextPage!)}
					hasMore={!!nextPage}
					loader={<Loader wrapperClassName={'my-10'} />}
					dataLength={messages.length}
					scrollableTarget='messages-container'
					className='flex flex-col-reverse'
					inverse
				>
					<ul ref={messageListRef} className='flex flex-col-reverse pb-2'>
						{messages.map((message: Message, index: number) => (
							<MessageItem
								key={message.id}
								message={message}
								participant={participant!}
								prevMessage={index === 0 ? null : messages[index - 1]}
								isLastMessage={0 === index}
							/>
						))}
					</ul>
				</InfiniteScroll>
			</Transition>
		)
	}

	return content
}
