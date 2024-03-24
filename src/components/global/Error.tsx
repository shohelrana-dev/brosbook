import { BiErrorCircle as ErrorIcon } from 'react-icons/bi'

type Props = { message?: string | null; isError?: boolean }

export default function Error({ isError = true, message }: Props) {
    if (!isError) return null

    return (
        <div className='bg-red-100 p-4 rounded-xl flex gap-2 items-center text-sm'>
            <ErrorIcon fontSize={20} className='text-danger flex-none' />
            {message ? message : 'An error has occured!'}
        </div>
    )
}
