export default function Error({ isError, message }: { message?: string; isError?: boolean }) {
	if (!message && typeof isError === 'undefined') {
		return null
	}

	return <div className='bg-danger p-4'>{message ? message : 'An error has occured!'}</div>
}
