import { Button } from '@mui/material'
import Link from 'next/link'

export default function NotFound() {
	return (
		<div className='flex flex-wrap flex-col items-center'>
			<h1 className='mt-10 text-5xl text-blue-500'>404</h1>
			<h1 className=' mb-4 text-2xl text-gray-800'>Page Not Found</h1>
			<Link href='/'>
				<Button variant='outlined'>Home</Button>
			</Link>
		</div>
	)
}
