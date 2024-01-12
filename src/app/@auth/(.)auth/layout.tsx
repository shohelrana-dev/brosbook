'use client'
import { IconButton, Tooltip } from '@mui/material'
import { usePathname, useRouter, useSelectedLayoutSegment } from 'next/navigation'
import { ReactNode } from 'react'
import { IoArrowBack as BackIcon } from 'react-icons/io5'
import Modal, { useToggle } from 'react-minimal-modal'

export default function Layout({ children }: { children: ReactNode }) {
	const router = useRouter()
	const pathname = usePathname()
	const segment = useSelectedLayoutSegment()
	const [isOpen, toggle] = useToggle(true)

	function handleClose() {
		toggle()

		//delay for show modal animation
		setTimeout(() => {
			router.back()
		}, 300)
	}

	if (pathname.endsWith('login') || pathname.endsWith('signup')) {
		if (!isOpen) toggle()
	} else {
		if (isOpen) return toggle()
		return null
	}

	return (
		<Modal
			open={isOpen}
			hideIcon
			className='!p-[1px]'
			width={420}
			onClose={handleClose}
			wrapperClassName='overflow-y-auto'
		>
			<Tooltip title='Go Back' onClick={handleClose}>
				<IconButton className='!absolute left-2 top-2'>
					<BackIcon size={20} />
				</IconButton>
			</Tooltip>

			{children}
		</Modal>
	)
}
