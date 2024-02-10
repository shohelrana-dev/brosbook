import { EmojiClickData } from 'emoji-picker-react'
import { FormEvent, useState } from 'react'
import { MdSend as SendIcon } from 'react-icons/md'
import { MessageType } from '~/interfaces/conversation.interfaces'
import { useSendMessageMutation } from '~/services/messagesApi'
//@ts-ignore
import { isMultipleEmoji } from 'is-emojis'
import { useParams } from 'next/navigation'
import BasicInput from '~/components/form/BasicInput'
import EmojiPickerInputIcon from '~/components/messages/MessageBox/form/EmojiPickerInputIcon'
import ImageInputIcon from '~/components/messages/MessageBox/form/ImageInputIcon'
import LikeInputIcon from '~/components/messages/MessageBox/form/LikeInputIcon'
import IconButton from '~/components/ui/IconButton'
import useSelectFile from '~/hooks/useSelectFile'
import { useGetConversationByIdQuery } from '~/services/conversationsApi'

export default function CreateMessageForm() {
	//hooks
	const { conversationId } = useParams()
	const { data: conversation } = useGetConversationByIdQuery(conversationId as string)
	const [sendMessage, { isLoading }] = useSendMessageMutation()
	const { inputRef, handleClick, handleChange, removeSelectedFile, selectedFile } = useSelectFile()
	const [messageText, setMessageText] = useState('')

	if (!conversation?.id) return null

	async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		if (!messageText && !selectedFile) return

		setMessageText('')
		removeSelectedFile()

		const conversationId = conversation?.id!
		const body = messageText
		const type = isMultipleEmoji(messageText)
			? MessageType.EMOJI
			: selectedFile
			? MessageType.IMAGE
			: MessageType.TEXT
		const image = selectedFile

		sendMessage({
			conversationId,
			data: { type, body, image },
		})
	}

	async function handleEmojiClick(emojiData: EmojiClickData) {
		setMessageText(`${messageText}${emojiData.emoji}`)
	}

	const inputStartContent = (
		<>
			<EmojiPickerInputIcon onEmojiClick={handleEmojiClick} isDisabled={!!selectedFile} />
			<ImageInputIcon
				inputRef={inputRef}
				onInputChange={handleChange}
				onGalleryClick={handleClick}
				selectedFile={selectedFile}
				onClose={removeSelectedFile}
				isDisabled={isLoading}
			/>
		</>
	)

	const inputEndContent = (
		<>
			<LikeInputIcon isDisabled={isLoading} />

			<IconButton
				type='submit'
				isDisabled={isLoading || (!messageText && !selectedFile)}
				className='text-primary'
			>
				<SendIcon fontSize={20} className='ml-1' />
			</IconButton>
		</>
	)

	return (
		<form onSubmit={handleFormSubmit}>
			<BasicInput
				startContent={inputStartContent}
				endContent={inputEndContent}
				classNames={{ inputWrapper: 'h-auto' }}
				onValueChange={setMessageText}
				value={messageText}
				disabled={isLoading}
			/>
		</form>
	)
}
