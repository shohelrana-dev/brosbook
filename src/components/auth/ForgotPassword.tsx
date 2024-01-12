'use client'
import { LoadingButton } from '@mui/lab'
import { Button } from '@mui/material'
import Link from 'next/link'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { FiLock } from 'react-icons/fi'
import AnimatedInput from '~/components/form/AnimatedInput'
import { useForm } from '~/hooks/useForm'
import { useForgotPasswordMutation } from '~/services/authApi'

export default function ForgotPassword() {
	//hooks
	const [forgotPassword, { isLoading, isSuccess }] = useForgotPasswordMutation()
	const { formData, onChange, onSubmit, errors } = useForm<{ email: string }>(forgotPassword)

	useEffect(() => {
		if (isSuccess) toast.success('An email has been sent to your email to reset your password.')
	}, [isSuccess])

	let content = null
	if (isSuccess) {
		content = (
			<div className='text-center'>
				<h1 className='heading-auth'>Reset Password</h1>
				<p>
					Check your email for a link to reset your password. If it doesn&apos;t appear within
					a few minutes, check your spam folder.
				</p>
				<Link href='/auth/login' className='inline-block mt-5'>
					<Button variant='outlined'>Return to login</Button>
				</Link>
			</div>
		)
	} else {
		content = (
			<>
				<h1 className='heading-auth'>Trouble with logging in?</h1>
				<small className='block text-gray-500 text-center mb-2'>
					Enter your email address and we will send you a link to get back into your account.
				</small>

				<form className='form' onSubmit={onSubmit}>
					<AnimatedInput
						label='Email'
						name='email'
						value={formData.email}
						error={errors.email}
						onChange={onChange}
					/>
					<LoadingButton
						variant='contained'
						type='submit'
						fullWidth
						loading={isLoading}
						size='large'
					>
						Send Reset Link
					</LoadingButton>
				</form>
			</>
		)
	}

	return (
		<>
			<div className='card-auth'>
				<div className='flex flex-wrap justify-center mb-2'>
					<FiLock size='30' />
				</div>

				{content}
			</div>

			<div className='card-auth text-center mt-2 text-gray-800'>
				Go back?&nbsp;
				<Link href='/auth/login' className='text-blue-500 font-medium'>
					Log In
				</Link>
			</div>
		</>
	)
}
