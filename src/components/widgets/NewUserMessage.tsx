'use client'
import { Button } from '@mui/material'
import Link from 'next/link'
import useAuthState from '~/hooks/useAuthState'

function NewUserMessage() {
	const { isAuthenticated } = useAuthState()

	if (isAuthenticated) return null

	return (
		<div className='card p-5'>
			<h2 className='text-xl font-medium mb-2'>New to {process.env.NEXT_PUBLIC_APP_NAME}?</h2>
			<p className='text-gray-800'>Sign up now to get your own personalized timeline!</p>

			<Link href='/auth/signup' className='block mt-3'>
				<Button>Goto Signup page</Button>
			</Link>
		</div>
	)
}

export default NewUserMessage
