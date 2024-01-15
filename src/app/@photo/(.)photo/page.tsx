'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Modal from 'react-minimal-modal'

interface Props {
	searchParams: {
		url: string
	}
}

export default function PhotoModal({ searchParams }: Props) {
	const router = useRouter()

	return (
		<Modal open onClose={() => router.back()} className='!bg-black'>
			<Image src={searchParams.url} width={1920} height={1080} alt='Photo' className='h-auto' />
		</Modal>
	)
}
