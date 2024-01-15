import Linkify from 'linkify-react'
import moment from 'moment'
import ImageLightbox from '~/components/global/ImageLightbox'
import Reactions from '~/components/messages/MessageBox/Reactions'
import { Message } from '~/interfaces/conversation.interfaces'
import cn from '~/utils/cn'

const classes = {
	textMessage: ({ isOwn, hasReaction }: { isOwn: boolean; hasReaction: boolean }) =>
		cn(
			'card relative flex items-end gap-1 text-sm lg:text-base bg-white text-gray-700 [&_a]:text-blue-500 [&_a]:underline [&_a]:font-medium',
			{ 'bg-primary text-white [&_a]:text-white': isOwn, 'mb-3': hasReaction }
		),
	emojiMessage: ({ hasReaction }: { hasReaction: boolean }) =>
		cn('relative pt-2 text-3xl flex items-end gap-1 text-gray-700', { 'mb-3': hasReaction }),
	imageMessage: 'relative max-w-52 flex items-end gap-1 text-gray-700',
	time: 'text-[10px] leading-3 text-right',
}

interface Props {
	message: Message
}

export default function MessageContent({ message }: Props) {
	const { type, isMeSender, body, image, reactions, createdAt } = message
	const hasReaction = reactions?.length > 0

	const timeMarkup = (
		<time className={classes.time} style={{ wordSpacing: -1 }}>
			{moment(createdAt).format('h:mm a')}
		</time>
	)

	switch (type) {
		case 'text':
			return (
				<div
					className={classes.textMessage({ hasReaction, isOwn: isMeSender })}
					style={{ padding: 10, wordBreak: 'break-word' }}
				>
					<Reactions message={message} />
					<span>
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
