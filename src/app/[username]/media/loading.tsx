import Loader from '~/components/global/Loader'

export default function PageLoading() {
	return (
		<div className='card text-center py-3 bg-white'>
			<Loader />
		</div>
	)
}
