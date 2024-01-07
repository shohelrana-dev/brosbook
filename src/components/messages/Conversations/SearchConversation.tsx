import BasicInput from '@components/form/BasicInput'
import SearchUserList from '@components/global/SearchUserList'
import { User } from '@interfaces/user.interfaces'
import {
	useCreateConversationMutation,
	useLazyGetConversationByParticipantIdQuery,
} from '@services/conversationsApi'
import { useRouter } from 'next/navigation'
import { useDebounce } from 'use-debounce'
import { useConfirmAlert } from 'react-use-confirm-alert'
import toast from 'react-hot-toast'
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state'
import { Popover } from '@mui/material'
import useInputValue from '@hooks/useInputValue'
import { useEffect, useRef } from 'react'
import cn from '@utils/cn'

export default function SearchConversation() {
	const [searchText, handleInputChange, resetSearchText] = useInputValue('')
	const [dSearchText] = useDebounce<string>(searchText, 1000)
	const [getConversationByParticipantId] = useLazyGetConversationByParticipantIdQuery()
	const [createConversation] = useCreateConversationMutation()
	const router = useRouter()
	const confirmAlert = useConfirmAlert()
	const inputRef = useRef<HTMLInputElement>()

	async function handleUserClick(user: User) {
		try {
			const conversation: any = await getConversationByParticipantId(user.id).unwrap()
			router.push(`/messages/${conversation.id}`)
		} catch (e) {
			confirmAlert({
				title: 'Create conversation?',
				message: `Do you want to create a new conversation with ${user.fullName}?`,
				confirmButtonLabel: 'Create',
				onConfirm: async () => {
					try {
						const conversation: any = await createConversation(user.id).unwrap()
						router.push(`/messages/${conversation.id}`)
					} catch (err) {
						console.log(err)
						toast.error('Failed to create conversation.')
					}
				},
			})
		} finally {
			resetSearchText()
		}
	}

	return (
		<PopupState variant='popover' disableAutoFocus>
			{popupState => {
				const { isOpen } = popupState

				useEffect(() => {
					isOpen && inputRef.current?.focus()
				}, [isOpen, inputRef.current])

				return (
					<div className={cn('mb-3', { 'relative z-9999': isOpen })}>
						<BasicInput
							{...bindTrigger(popupState)}
							label='Search user'
							labelHide={true}
							onChange={handleInputChange}
							autoComplete='off'
							inputRef={inputRef}
						/>
						<Popover
							{...bindPopover(popupState)}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'center',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'center',
							}}
							sx={{ '& .MuiPaper-root': { width: `${inputRef.current?.offsetWidth}px` } }}
						>
							<SearchUserList
								searchText={dSearchText}
								handleUserClick={handleUserClick}
								hideFollowButton
							/>
						</Popover>
					</div>
				)
			}}
		</PopupState>
	)
}
