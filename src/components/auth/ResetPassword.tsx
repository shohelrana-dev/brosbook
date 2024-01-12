'use client'
import { LoadingButton } from '@mui/lab'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { FiLock } from 'react-icons/fi'
import PasswordInput from '~/components/form/PasswordInput'
import { useForm } from '~/hooks/useForm'
import { ResetPassPayload } from '~/interfaces/auth.interfaces'
import { useResetPasswordMutation } from '~/services/authApi'

export default function ResetPassword({ token }: { token: string }) {
	//hooks
	const router = useRouter()
	const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation()
	const { formData, onChange, onSubmit, errors } = useForm<ResetPassPayload>(resetPassword, {
		token: token,
		password: '',
		confirmPassword: '',
	})

	useEffect(() => {
		if (isSuccess) {
			toast.success('Your login password has been changed.')
			router.push('/auth/login')
		}
	}, [isSuccess])

	return (
		<>
			<div className='card-auth'>
				<div className='flex flex-wrap justify-center mb-2'>
					<FiLock size='30' />
				</div>

				<h1 className='heading-auth'>Create a strong password</h1>
				<small className='block text-gray-500 text-center mb-2'>
					Enter your new password to reset account password. Your password must be at least six
					characters.
				</small>

				<form className='form' method='post' onSubmit={onSubmit}>
					<PasswordInput
						label='Password'
						name='password'
						value={formData.password}
						error={errors.password}
						onChange={onChange}
					/>
					<PasswordInput
						label='Confirm Password'
						name='confirmPassword'
						value={formData.confirmPassword}
						error={errors.confirmPassword}
						onChange={onChange}
					/>
					<LoadingButton
						variant='contained'
						type='submit'
						loading={isLoading || isSuccess}
						size='large'
					>
						Reset
					</LoadingButton>
				</form>
			</div>

			<div className='card-auth text-center mt-2 text-gray-800'>
				Go back? &nbsp;
				<Link href='/auth/login' className='text-blue-500 font-medium'>
					Log In
				</Link>
			</div>
		</>
	)
}
