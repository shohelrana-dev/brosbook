import { IconButton, Popover } from '@mui/material'
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state'
import Image from 'next/image'
import { HiOutlineEmojiHappy as EmojiIcon } from 'react-icons/hi'
import { Message } from '~/interfaces/conversation.interfaces'
import { useSendReactionMutation } from '~/services/messagesApi'

export default function ReactionsInput({ message }: { message: Message }) {
	const { id, conversation } = message
	//hooks
	const [sendReaction] = useSendReactionMutation()

	//default message reactions
	const defaultReactions = ['love', 'smile', 'wow', 'sad', 'angry', 'like']

	async function handleSubmitReaction(name: string) {
		sendReaction({ name, conversationId: conversation?.id!, messageId: id })
	}

	return (
		<PopupState variant='popover'>
			{popupState => (
				<>
					<div className='mt-1'>
						<IconButton {...bindTrigger(popupState)}>
							<EmojiIcon className='text-gray-400' fontSize={20} />
						</IconButton>
					</div>
					<Popover
						classes={{
							paper: '!rounded-full pb-[3px] pt-[5px] px-2',
						}}
						style={{
							borderRadius: '25px',
						}}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'center',
						}}
						transformOrigin={{
							vertical: 'bottom',
							horizontal: 'center',
						}}
						{...bindPopover(popupState)}
					>
						{defaultReactions.map(reaction => (
							<button
								onClick={() => {
									handleSubmitReaction(reaction)
									popupState.setOpen(false)
								}}
								key={reaction}
								className='mr-1'
							>
								<Image
									className='w-7'
									width={28}
									height={28}
									src={`${process.env
										.NEXT_PUBLIC_SERVER_BASE_URL!}/reactions/${reaction}.png`}
									alt='Reaction'
								/>
							</button>
						))}
					</Popover>
				</>
			)}
		</PopupState>
	)
}
