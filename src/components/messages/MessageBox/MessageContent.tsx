import Reactions from '@components/messages/MessageBox/Reactions'
import { Message } from '@interfaces/conversation.interfaces'
import ImageLightbox from '@components/global/ImageLightbox'
import moment from 'moment'
import Linkify from 'linkify-react'
import cn from '@utils/cn'

const classes = {
	textMessage: ({ isOwn, hasReaction }: { isOwn: boolean; hasReaction: boolean }) =>
		cn(
			'box relative flex items-end gap-1 text-sm lg:text-base bg-white text-gray-700 [&_a]:text-blue-500 [&_a]:underline',
			{ 'bg-primary text-white [&_a]:text-white': isOwn, 'mb-3': hasReaction }
		),
	emojiMessage: ({ hasReaction }: { hasReaction: boolean }) =>
		cn('relative pt-2 text-3xl flex items-end gap-1 text-gray-700', { 'mb-3': hasReaction }),
	imageMessage: 'relative max-w-52 flex items-end gap-1 text-gray-700',
	time: 'text-[10px]',
}

interface Props {
	message: Message
}

export default function MessageContent({ message }: Props) {
	const { type, isMeSender, body, image, reactions, createdAt } = message
	const hasReaction = reactions?.length > 0

	const timeMarkup = <time className={classes.time}>{moment(createdAt).format('h:mm a')}</time>

	switch (type) {
		case 'text':
			return (
				<div
					className={classes.textMessage({ hasReaction, isOwn: isMeSender })}
					style={{ padding: 10 }}
				>
					<Reactions message={message} />
					<span className='break-all'>
						<Linkify>{body}</Linkify>
					</span>
					{timeMarkup}
				</div>
			)

		case 'emoji':
			return (
				<div className={classes.emojiMessage({ hasReaction })}>
					<Reactions message={message} />
					{body}
					{timeMarkup}
				</div>
			)

		case 'image':
			return (
				<div className={classes.imageMessage}>
					<Reactions message={message} />
					<ImageLightbox image={image} width='300' height='200' alt='message image' />
					{timeMarkup}
				</div>
			)

		default:
			return null
	}
}
