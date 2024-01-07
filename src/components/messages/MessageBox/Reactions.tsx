import Image from 'next/image'
import { HiOutlineEmojiHappy as EmojiIcon } from 'react-icons/hi'
import { Popover } from '@mui/material'
import { IconButton } from '@mui/material'
import { useSendReactionMutation } from '@services/messagesApi'
import { Message } from '@interfaces/conversation.interfaces'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'
import cn from '@utils/cn'

export default function Reactions({ message }: { message: Message }) {
	const { isMeSender } = message
	//hooks
	const [sendReaction] = useSendReactionMutation()

	//default message reactions
	const defaultReactions = ['love', 'smile', 'wow', 'sad', 'angry', 'like']

	async function handleSubmitReaction(name: string) {
		sendReaction({ name, conversationId: message.conversation?.id!, messageId: message.id })
	}

	return (
		<>
			<PopupState variant='popover'>
				{popupState => (
					<div>
						<div
							className={cn('absolute top-1/2 -translate-y-1/2', {
								'-left-9': isMeSender,
								'-right-9': !isMeSender,
							})}
						>
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
							<div>
								{defaultReactions.map(reaction => (
									<button
										onClick={() => {
											handleSubmitReaction(reaction)
											popupState.setOpen(false)
										}}
										key={reaction}
									>
										<img
											className='w-7'
											src={`${process.env
												.NEXT_PUBLIC_SERVER_BASE_URL!}/reactions/${reaction}.png`}
											alt='reaction'
										/>
									</button>
								))}
							</div>
						</Popover>
					</div>
				)}
			</PopupState>

			{message.reactions?.length > 0 ? (
				<div
					className={cn(
						'absolute w-max -bottom-4 flex gap-x-1 justify-center p-[2px] bg-white rounded-full px-1',
						{ 'left-2': isMeSender, 'right-2': !isMeSender }
					)}
				>
					{message.reactions.map(reaction => (
						<Image
							width={18}
							height={18}
							src={reaction.url}
							alt='Reaction'
							key={reaction.id}
							className=''
						/>
					))}
				</div>
			) : null}
		</>
	)
}
