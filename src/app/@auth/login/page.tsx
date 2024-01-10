'use client'
import Login from '@/components/auth/Login'
import { IconButton, Tooltip } from '@mui/material'
import { useRouter } from 'next/navigation'
import { IoArrowBack as BackIcon } from 'react-icons/io5'
import Modal from 'react-minimal-modal'

export default function LoginPopup() {
	const router = useRouter()

	return (
		<Modal open={true} hideIcon className='!p-[1px]' width={420} onClose={router.back}>
			<Tooltip title='Go Back' onClick={router.back}>
				<IconButton className='absolute left-2 top-2'>
					<BackIcon size={20} />
				</IconButton>
			</Tooltip>
			<Login />
		</Modal>
	)
}
