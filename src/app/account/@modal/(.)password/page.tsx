'use client'
import { LoadingButton } from '@mui/lab'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import Modal, { useToggle } from 'react-minimal-modal'
import PasswordInput from '~/components/form/PasswordInput'
import useAuth from '~/hooks/useAuth'
import { useForm } from '~/hooks/useForm'
import { ChangePasswordPayload } from '~/interfaces/account.interfaces'
import { useChangePasswordMutation } from '~/services/accountApi'

export default function ChangePasswordModal() {
	const [changePassword, { isLoading, isSuccess }] = useChangePasswordMutation()
	const { formData, onChange, onSubmit, errors, reset } =
		useForm<ChangePasswordPayload>(changePassword)
	const router = useRouter()
	const [isOpen, toggle] = useToggle(true)
	const _ = useAuth({ require: true })

	useEffect(() => {
		if (isSuccess) {
			toast.success('Password changed.')
			handleClose()
		}
	}, [isSuccess])

	function handleClose() {
		toggle()

		//delay for show modal animation
		setTimeout(() => {
			reset()
			router.back()
		}, 300)
	}

	return (
		<Modal open={isOpen} title='Update your password' width={700} onClose={handleClose}>
			<p className='mb-6 text-gray-700 -mt-1'>
				Do not share your password with anyone. Set new password using current password.
			</p>
			<form className='form' onSubmit={onSubmit} autoComplete='off'>
				<div>
					<PasswordInput
						label='Current Password'
						name='currentPassword'
						value={formData.currentPassword}
						error={errors.currentPassword}
						onChange={onChange}
					/>
					<Link href='/auth/forgot_password' className='text-blue-600 text-sm block'>
						Forgot password?
					</Link>
				</div>
				<PasswordInput
					label='New Password'
					name='newPassword'
					value={formData.newPassword}
					error={errors.newPassword}
					onChange={onChange}
				/>
				<PasswordInput
					label='Confirm New Password'
					name='confirmNewPassword'
					value={formData.confirmNewPassword}
					error={errors.confirmNewPassword}
					onChange={onChange}
				/>

				<div className='text-right mt-4'>
					<LoadingButton variant='contained' type='submit' loading={isLoading} size='large'>
						Update
					</LoadingButton>
				</div>
			</form>
		</Modal>
	)
}
