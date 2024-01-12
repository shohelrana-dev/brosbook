'use client'
import { LoadingButton } from '@mui/lab'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import Modal, { useToggle } from 'react-minimal-modal'
import AnimatedInput from '~/components/form/AnimatedInput'
import PasswordInput from '~/components/form/PasswordInput'
import useAuthState from '~/hooks/useAuthState'
import { useForm } from '~/hooks/useForm'
import { ChangeUsernamePayload } from '~/interfaces/account.interfaces'
import { useChangeUsernameMutation } from '~/services/accountApi'

export default function ChangeUsernameModal() {
	const { user } = useAuthState()
	const [changeUsername, { isLoading, isSuccess }] = useChangeUsernameMutation()
	const { formData, onChange, onSubmit, errors, reset } = useForm<ChangeUsernamePayload>(
		changeUsername,
		{
			username: user?.username!,
			password: '',
		}
	)
	const [isOpen, toggle] = useToggle(true)
	const router = useRouter()

	useEffect(() => {
		if (isSuccess) {
			toast.success('Username changed.')
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
		<Modal open={isOpen} title='Update username' width={700} onClose={handleClose}>
			<p className='mb-6 text-gray-700 -mt-1'>Set your new username using password.</p>
			<form className='form' onSubmit={onSubmit} autoComplete='off'>
				<AnimatedInput
					label='Username'
					name='username'
					value={formData.username}
					error={errors.username}
					onChange={onChange}
				/>
				<div>
					<PasswordInput
						label='Password'
						name='password'
						value={formData.password}
						error={errors.password}
						onChange={onChange}
					/>
					<Link href='/auth/forgot_password' className='text-blue-600 text-sm block'>
						Forgot password?
					</Link>
				</div>

				<div className='text-right'>
					<LoadingButton variant='contained' type='submit' loading={isLoading} size='large'>
						Update
					</LoadingButton>
				</div>
			</form>
		</Modal>
	)
}
