import Image from 'next/image'
import { ChangeEvent, RefObject } from 'react'
import { RiGalleryLine as GalleryIcon } from 'react-icons/ri'
import { RxCross2 as CancelIcon } from 'react-icons/rx'
import IconButton from '~/components/ui/IconButton'

interface Props {
	inputRef: RefObject<HTMLInputElement>
	onInputChange: (e: ChangeEvent<HTMLInputElement>) => void
	onGalleryClick: () => void
	selectedFile: Blob | null
	onClose: () => void
	isDisabled?: boolean
}

export default function ImageInputIcon(props: Props) {
	const { inputRef, selectedFile, onInputChange, onGalleryClick, isDisabled, onClose } = props

	return (
		<>
			<IconButton className='text-primary' isDisabled={isDisabled}>
				<input
					ref={inputRef}
					onChange={onInputChange}
					type='file'
					name='file'
					accept='image/*'
					hidden
				/>
				<GalleryIcon onClick={onGalleryClick} fontSize={17} />
			</IconButton>

			{!!selectedFile && (
				<div className='max-w-[200px] flex justify-center mx-3 my-1 relative rounded-2xl'>
					<Image
						src={URL.createObjectURL(selectedFile!)}
						width={300}
						height={200}
						alt='Thumb'
						className='rounded-2xl'
					/>

					<IconButton color='black' className='absolute right-1 top-1 z-20' onClick={onClose}>
						<CancelIcon size={15} />
					</IconButton>
				</div>
			)}
		</>
	)
}
