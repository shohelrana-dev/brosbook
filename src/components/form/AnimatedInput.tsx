import { Input, InputProps } from '@nextui-org/react'
import { MdReportGmailerrorred as ErrorIcon } from 'react-icons/md'
import ucfirst from '~/utils/ucfirst'

export interface AnimatedInputProps extends InputProps {
	error?: string
}

export default function AnimatedInput(props: AnimatedInputProps) {
	let { label, name, error, size = 'medium', ...rest } = props

	name = name ? name : (label as string).toLowerCase().replace(' ', '')
	const isError = !!error

	return (
		<Input
			type='text'
			label={label}
			variant='bordered'
			name={name}
			isInvalid={isError}
			color='primary'
			classNames={{
				label: 'font-medium',
				inputWrapper: 'bg-[#F3F6F9] hover:bg-white',
				errorMessage: 'font-medium',
			}}
			errorMessage={ucfirst(error)}
			endContent={isError && <ErrorIcon size={18} className='text-red-600 self-center' />}
			{...rest}
		/>
	)
}
