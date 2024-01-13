import { PropsWithChildren } from 'react'
import Sidebar from '~/components/global/Sidebar'

export default function SidebarLayout({ children }: PropsWithChildren) {
	return (
		<main className='max-w-[920px] mx-auto'>
			<div className='grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-x-5'>
				{children}

				<Sidebar />
			</div>
		</main>
	)
}
