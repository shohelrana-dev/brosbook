'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent } from 'react'
import Modal, { useToggle } from 'react-minimal-modal'
import { toast } from 'sonner'
import PasswordInput from '~/components/form/PasswordInput'
import Button from '~/components/ui/Button'
import useAuth from '~/hooks/useAuth'
import { useForm } from '~/hooks/useForm'
import { ChangePasswordPayload } from '~/interfaces/account.interfaces'
import { useChangePasswordMutation } from '~/services/accountApi'
import { getErrorData } from '~/utils/error'

export default function ChangePasswordModal() {
	const [changePassword, { isLoading, error }] = useChangePasswordMutation()
	const { formData, handleChange } = useForm<ChangePasswordPayload>()
	const router = useRouter()
	const [isOpen, toggle] = useToggle(true)
	useAuth({ require: true })

	const { errors } = getErrorData<ChangePasswordPayload>(error) || {}

	async function handleFormSubmit(e: FormEvent) {
		e.preventDefault()

		try {
			await changePassword(formData).unwrap()

			toast.success('Password changed.')
			handleClose()
		} catch (err: any) {
			toast.error(err?.data?.message || 'Request failed.')
		}
	}

	function handleClose() {
		toggle()

		//delay for show modal animation
		setTimeout(() => {
			router.back()
		}, 300)
	}

	return (
		<Modal open={isOpen} title='Update your password' width={700} onClose={handleClose}>
			<p className='mb-6 text-gray-700 -mt-1'>
				Do not share your password with anyone. Set new password using current password.
			</p>
			<form className='form' onSubmit={handleFormSubmit} autoComplete='off'>
				<div>
					<PasswordInput
						label='Current Password'
						name='currentPassword'
						value={formData.currentPassword}
						error={errors?.currentPassword}
						onChange={handleChange}
					/>
					<Link href='/auth/forgot_password' className='text-blue-600 text-sm block'>
						Forgot password?
					</Link>
				</div>
				<PasswordInput
					label='New Password'
					name='newPassword'
					value={formData.newPassword}
					error={errors?.newPassword}
					onChange={handleChange}
				/>
				<PasswordInput
					label='Confirm New Password'
					name='confirmNewPassword'
					value={formData.confirmNewPassword}
					error={errors?.confirmNewPassword}
					onChange={handleChange}
				/>

				<div className='text-right mt-4'>
					<Button type='submit' isLoading={isLoading} className='min-w-32'>
						Update
					</Button>
				</div>
			</form>
		</Modal>
	)
}
