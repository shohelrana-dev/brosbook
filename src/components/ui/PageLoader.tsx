'use client'
import { BarLoader } from 'react-spinners'

export default function PageLoader() {
	return (
		<div className='fixed w-full left-0 top-navbar'>
			<BarLoader color='#ff971c' width='100%' height='5px' />
		</div>
	)
}
