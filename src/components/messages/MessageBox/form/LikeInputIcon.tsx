import { useParams } from 'next/navigation'
import { BsHeartFill as LikeIcon } from 'react-icons/bs'
import IconButton from '~/components/ui/IconButton'
import { MessageType } from '~/interfaces/conversation.interfaces'
import { useGetConversationByIdQuery } from '~/services/conversationsApi'
import { useSendMessageMutation } from '~/services/messagesApi'

export default function LikeInputIcon({ isDisabled }: { isDisabled: boolean }) {
	const { conversationId } = useParams()
	const { data: conversation } = useGetConversationByIdQuery(conversationId as string)
	const [sendMessage, { isLoading }] = useSendMessageMutation()

	async function handleLikeClick() {
		const love = '❤️'

		await sendMessage({
			conversationId: conversation?.id!,
			data: {
				type: MessageType.EMOJI,
				body: love,
			},
		})
	}

	return (
		<IconButton onClick={handleLikeClick} isDisabled={isLoading || isDisabled}>
			<LikeIcon fontSize='medium' color='#FF1493' className='mt-[2px]' />
		</IconButton>
	)
}
