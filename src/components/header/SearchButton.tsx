import { IconButton, Popover, Tooltip } from '@mui/material'
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { BiSearch as SearchIcon } from 'react-icons/bi'
import { IoArrowBack as BackIcon } from 'react-icons/io5'
import { useDebounce } from 'use-debounce'
import BasicInput from '~/components/form/BasicInput'
import SearchUserList from '~/components/global/SearchUserList'
import useInputValue from '~/hooks/useInputValue'
import { User } from '~/interfaces/user.interfaces'

export default function SearchButton() {
	const [searchText, handleInputChange, resetInputValue] = useInputValue('')
	const [dSearchText] = useDebounce<string>(searchText, 1000)
	const router = useRouter()
	const inputRef = useRef<HTMLInputElement>()

	async function handleUserClick(user: User) {
		router.push(`/${user.username}`)
	}

	return (
		<PopupState variant='popover' disableAutoFocus>
			{popupState => {
				const { isOpen, setOpen } = popupState
				//eslint-disable-next-line
				useEffect(() => {
					isOpen && inputRef.current?.focus()

					!isOpen && resetInputValue()
				}, [isOpen])

				return (
					<>
						<Tooltip title='Search'>
							<IconButton {...bindTrigger(popupState)}>
								<SearchIcon size={18} className='text-gray-700 ' />
							</IconButton>
						</Tooltip>

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
						>
							<div className='flex gap-1 items-center p-3 pl-1 pb-0'>
								<IconButton className='h-8 w-8' onClick={() => setOpen(false)}>
									<BackIcon size={20} />
								</IconButton>
								<BasicInput
									onChange={handleInputChange}
									value={searchText}
									inputRef={inputRef}
									className='rounded-3xl z-10 bg-transparent mt-1 py-2 bg-gray-100 flex-grow'
									wrapperClassname='mb:0 md:mb-0 flex-grow'
									type='text'
									label='Search'
									labelHide
									autoComplete='off'
									autoFocus
								/>
							</div>
							<SearchUserList searchText={dSearchText} />
						</Popover>
					</>
				)
			}}
		</PopupState>
	)
}
