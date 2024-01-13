import { ReactNode } from 'react'

interface Props {
	children: ReactNode
}

export default function Layout({ children }: Props) {
	return <main className='w-100 max-w-full mx-auto mt-12 lg:mt-28 relative z-50'>{children}</main>
}
