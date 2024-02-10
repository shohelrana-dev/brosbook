import { Popover, PopoverContent } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { BiSearch as SearchIcon } from 'react-icons/bi'
import { useConfirmAlert } from 'react-use-confirm-alert'
import { toast } from 'sonner'
import BasicInput from '~/components/form/BasicInput'
import SearchUserList from '~/components/ui/SearchUserList'
import useFocus from '~/hooks/useFocus'
import useInputValue from '~/hooks/useInputValue'
import { User } from '~/interfaces/user.interfaces'
import {
   useCreateConversationMutation,
   useLazyGetConversationByParticipantIdQuery,
} from '~/services/conversationsApi'

export default function SearchConversation() {
	const [searchText, handleInputChange, resetSearchText] = useInputValue('')
	const [getConversationByParticipantId] = useLazyGetConversationByParticipantIdQuery()
	const [createConversation] = useCreateConversationMutation()
	const router = useRouter()
	const confirmAlert = useConfirmAlert()
	const { inputRef, isFocused } = useFocus()
	const triggerRef = useRef<HTMLSpanElement>(null)
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		isFocused && setIsOpen(true)
	}, [isFocused])

	async function handleUserClick(user: User) {
		try {
			const conversation = await getConversationByParticipantId(user.id).unwrap()
			router.push(`/messages/${conversation.id}`)
		} catch (e) {
			confirmAlert({
				title: 'Create conversation?',
				message: `Do you want to create a new conversation with ${user.fullName}?`,
				confirmButtonLabel: 'Create',
				onConfirm: async () => {
					try {
						const conversation = await createConversation(user.id).unwrap()
						router.push(`/messages/${conversation.id}`)
					} catch (err) {
						console.error(err)
						toast.error('Failed to create conversation.')
					}
				},
			})
		} finally {
			resetSearchText()
		}
	}

	function handleOpenChange(open: boolean) {
		!open && inputRef.current?.blur()
		setIsOpen(open)
	}

	const innerWrapperWidth = triggerRef.current?.querySelector(
		'[data-slot="inner-wrapper"]'
	)?.clientWidth

	return (
		<Popover
			placement='bottom'
			isOpen={isOpen}
			onOpenChange={handleOpenChange}
			triggerRef={triggerRef}
			showArrow
		>
			<span ref={triggerRef}>
				<BasicInput
					className='z-99'
					placeholder='Search Conversation'
					aria-label='Search Conversation'
					onChange={handleInputChange}
					value={searchText}
					autoComplete='off'
					startContent={<SearchIcon className='text-default-400' size={18} />}
					ref={inputRef}
					isClearable
					onClear={resetSearchText}
				/>
			</span>

			<PopoverContent tabIndex={null!}>
				<SearchUserList
					searchText={searchText}
					onUserClick={handleUserClick}
					hideFollowButton
					style={{
						width: innerWrapperWidth ? innerWrapperWidth + 10 : undefined,
					}}
				/>
			</PopoverContent>
		</Popover>
	)
}
