'use client'
import { Button, Divider } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import PasswordStrengthBar from 'react-password-strength-bar'
import { useDispatch } from 'react-redux'
import AnimatedInput from '~/components/form/AnimatedInput'
import PasswordInput from '~/components/form/PasswordInput'
import GoogleLoginButton from '~/components/global/GoogleLoginButton'
import LoadingOverlay from '~/components/global/LoadingOverlay'
import { useForm } from '~/hooks/useForm'
import { SignupPayload } from '~/interfaces/auth.interfaces'
import { useSignupMutation } from '~/services/authApi'
import { setEmail } from '~/slices/authSlice'

export default function Signup() {
	//hooks
	const dispatch = useDispatch()
	const router = useRouter()
	const [signup, { isLoading, isSuccess }] = useSignupMutation()
	const { formData, onChange, onSubmit, errors } = useForm<SignupPayload>(signup)
	const [loading, setLoading] = useState(isLoading)

	useEffect(() => {
		if (isSuccess) {
			toast.success('Signup success. You have received a mail to verify the account.')
			dispatch(setEmail(formData.email))
			router.push('/auth/email_verification/required')
		}
	}, [isSuccess])

	return (
		<>
			<LoadingOverlay isLoading={loading || isSuccess} />

			<div className='card-auth'>
				<h1 className='heading-auth'>Sign Up</h1>

				<GoogleLoginButton
					onLoading={() => setLoading(true)}
					onComplete={() => setLoading(false)}
				/>

				<Divider className='!my-5'>OR</Divider>

				<form className='form' method='post' onSubmit={onSubmit}>
					<AnimatedInput
						label='First Name'
						name='firstName'
						value={formData.firstName}
						error={errors.firstName}
						onChange={onChange}
					/>
					<AnimatedInput
						label='Last Name'
						name='lastName'
						value={formData.lastName}
						error={errors.lastName}
						onChange={onChange}
					/>
					<AnimatedInput
						label='Email'
						name='email'
						value={formData.email}
						error={errors.email}
						onChange={onChange}
					/>
					<AnimatedInput
						label='Username'
						name='username'
						value={formData.username}
						error={errors.username}
						onChange={onChange}
					/>
					<PasswordInput
						label='Password'
						name='password'
						value={formData.password}
						error={errors.password}
						onChange={onChange}
					/>
					{formData.password ? <PasswordStrengthBar password={formData.password} /> : null}

					<Button variant='contained' type='submit' size='large'>
						Sign Up
					</Button>
				</form>

				<p className='text-center text-gray-600 text-xs mt-3'>
					By signing up, you agree to our Terms, Data Policy and Cookie Policy.
				</p>
			</div>

			<div className='card-auth text-center mt-2 text-gray-800'>
				Have an account? &nbsp;
				<Link href='/auth/login' className='text-blue-500 font-medium'>
					Log In
				</Link>
			</div>
		</>
	)
}
