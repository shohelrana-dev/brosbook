import moment from 'moment/moment'
import Image from 'next/image'
import { BsCircle as CircleIcon } from 'react-icons/bs'
import { IoCheckmarkCircleOutline as TickIcon } from 'react-icons/io5'
import MessageContent from '~/components/messages/MessageBox/MessageContent'
import ReactionsInput from '~/components/messages/MessageBox/ReactionsInput'
import Avatar from '~/components/ui/Avatar'
import { Message } from '~/interfaces/conversation.interfaces'
import { User } from '~/interfaces/user.interfaces'
import cn from '~/utils/cn'
import timeAgo from '~/utils/timeAgo'

const classes = {
	row: ({ isOwn }: { isOwn: boolean }) =>
		cn('flex flex-wrap mb-[2px] max-w-3/4', { 'justify-end ml-auto': isOwn }),
	time: 'text-gray-500 text-xs',
}

interface Props {
	message: Message
	prevMessage: Message | null
	isLastMessage: boolean
	participant: User
}

export default function MessageItem({ message, prevMessage, isLastMessage, participant }: Props) {
	const { isMeSender, createdAt, seenAt, sender } = message

	const timeDiff = moment(prevMessage?.createdAt).diff(createdAt, 'minutes')
	const isSameUser = prevMessage && sender.id === prevMessage?.sender.id
	const isSameUserAndTimeLessThanFiveMin = isSameUser && timeDiff <= 5

	const avatarMarkup = (
		<Avatar online={sender.active} alt={sender.fullName} src={sender.avatar.url} size='small' />
	)

	const seenMarkup = seenAt ? (
		<Image
			src={participant?.avatar.url}
			alt={'User photo'}
			width={15}
			height={15}
			className='h-[16px] w-[16px] object-cover rounded-full'
		/>
	) : (
		<p className='text-gray-600'>{createdAt ? <TickIcon size={17} /> : <CircleIcon size={14} />}</p>
	)

	return (
		<li className={classes.row({ isOwn: isMeSender })}>
			{!isMeSender && (
				<div className='w-9 mr-1 mt-1'>{!isSameUserAndTimeLessThanFiveMin && avatarMarkup}</div>
			)}

			<div>
				<div className='flex'>
					{isMeSender && <ReactionsInput message={message} />}

					<MessageContent message={message} />

					{!isMeSender && <ReactionsInput message={message} />}

					{isMeSender && (
						<div className='min-w-[20px] self-end ml-1'>{isLastMessage && seenMarkup}</div>
					)}
				</div>

				<div className='flex justify-between'>
					{!isSameUserAndTimeLessThanFiveMin && createdAt ? (
						<time className={classes.time}>{timeAgo(createdAt)}</time>
					) : null}
				</div>
			</div>
		</li>
	)
}
