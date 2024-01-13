'use client'
import { Button, Divider } from '@mui/material'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiLock } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import AnimatedInput from '~/components/form/AnimatedInput'
import PasswordInput from '~/components/form/PasswordInput'
import GoogleLoginButton from '~/components/global/GoogleLoginButton'
import LoadingOverlay from '~/components/global/LoadingOverlay'
import { useForm } from '~/hooks/useForm'
import { CredentialPayload } from '~/interfaces/auth.interfaces'
import { useLoginMutation } from '~/services/authApi'
import { baseApi } from '~/services/baseApi'
import { setEmail } from '~/slices/authSlice'

export default function Login() {
	//hooks
	const router = useRouter()
	const dispatch = useDispatch()
	const params = useSearchParams()
	const [login, { isLoading, isSuccess, data }] = useLoginMutation()
	const { formData, onChange, onSubmit, errors } = useForm<CredentialPayload>(login)
	const [loading, setLoading] = useState(isLoading)

	useEffect(() => {
		if (isSuccess) {
			if (data?.user?.hasEmailVerified) {
				toast.success('Logged in.')
				dispatch(baseApi.util.resetApiState())
				router.replace(params.get('redirect_to') ? params.get('redirect_to')! : '/')
			} else {
				toast.error('Your email not verified yet.')
				dispatch(setEmail(data?.user?.email!))
				router.push('/auth/email_verification/required')
			}
		}
	}, [isSuccess, params])

	return (
		<>
			<LoadingOverlay isLoading={loading || isSuccess} />

			<div className='card-auth'>
				<div className='flex flex-wrap justify-center mb-2'>
					<FiLock size='30' />
				</div>
				<h1 className='heading-auth'>
					Log In to {process.env.NEXT_PUBLIC_APP_NAME || 'Brosbook'}
				</h1>

				<form className='form' method='post' onSubmit={onSubmit}>
					<AnimatedInput
						label='Username or email'
						name='username'
						value={formData.username}
						error={errors?.username}
						onChange={onChange}
					/>
					<PasswordInput
						label='Password'
						name='password'
						value={formData.password}
						error={errors?.password}
						onChange={onChange}
					/>
					<Button variant='contained' type='submit' fullWidth size='large'>
						Log In
					</Button>
				</form>

				<Divider className='!my-5'>OR</Divider>

				<GoogleLoginButton
					onLoading={() => setLoading(true)}
					onComplete={() => setLoading(false)}
				/>

				<small className='block text-center mt-2'>
					<Link href='/auth/forgot_password' className='text-blue-500'>
						Forgotten your password?
					</Link>
				</small>
			</div>

			<div className='card-auth text-center mt-2 text-gray-800'>
				Don&apos;t have an account? &nbsp;
				<Link href='/auth/signup' className='text-blue-500 font-medium'>
					Sign Up
				</Link>
			</div>
		</>
	)
}
