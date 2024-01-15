import { redirect } from 'next/navigation'

interface Props {
	searchParams: {
		url: string
	}
}

export default function PhotoModal({ searchParams }: Props) {
	redirect(searchParams.url)

	return null
}
