'use client'
import { LoadingButton } from '@mui/lab'
import { IconButton, Tooltip } from '@mui/material'
import { FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { HiPhotograph } from 'react-icons/hi'
import { MdPublic as PublicIcon } from 'react-icons/md'
import { RxCross2 as CancelIcon } from 'react-icons/rx'

import { useToggle } from 'react-minimal-modal'
import BasicInput from '~/components/form/BasicInput'
import Avatar from '~/components/global/Avatar'
import DarkOverlay from '~/components/global/DarkOverlay'
import useAuth from '~/hooks/useAuth'
import useFocus from '~/hooks/useFocus'
import useSelectFile from '~/hooks/useSelectFile'
import { useCreatePostMutation } from '~/services/postsApi'

export default function CreatePostForm() {
	//hooks
	const { user, isAuthenticated } = useAuth()
	const [createPost, { isLoading }] = useCreatePostMutation()
	const [messageBody, setMessageBody] = useState<string>('')
	const {
		inputRef: fileInputRef,
		selectedFile: selectedImage,
		removeSelectedFile,
		onChange,
		onClick,
	} = useSelectFile()
	const [isOpen, toggleVisibility] = useToggle()
	const { inputRef, focus } = useFocus()

	useEffect(() => {
		if (isOpen) focus()
	}, [isOpen])

	async function submitForm(event: FormEvent) {
		event.preventDefault()

		if (!messageBody && !selectedImage) return

		const formData = new FormData()
		if (messageBody) {
			formData.append('body', messageBody)
		}
		if (selectedImage) {
			formData.append('image', selectedImage)
		}

		try {
			await createPost(formData).unwrap()
			toast.success('Post published.')
			if (messageBody) setMessageBody('')
			if (selectedImage) {
				removeSelectedFile()
			}
		} catch (err: any) {
			console.error(err)
			toast.error("Post couldn't be saved.")
		}
	}

	if (!isAuthenticated) return null

	return (
		<div className='mb-5'>
			<DarkOverlay isOpen={isOpen} onClick={isOpen ? toggleVisibility : undefined} />

			{!isOpen && (
				<form onSubmit={submitForm} className='card px-4 py-6 pt-8 flex z-10 relative'>
					<Avatar src={user?.avatar?.url} size='small' />
					<span className='inline-block mr-3' />
					<div className='flex-grow'>
						<BasicInput
							label="What's your mind?"
							labelHide
							onChange={e => setMessageBody(e.target.value)}
							value={isOpen ? '' : messageBody}
							onFocus={toggleVisibility}
							className='focus:border-gray-200'
						/>
						<div className='flex flex-wrap justify-between items-center'>
							<IconButton
								sx={{
									padding: '10px',
									marginTop: '-10px',
									color: theme => theme.palette.primary.main,
								}}
								onClick={toggleVisibility}
							>
								<HiPhotograph fontSize={25} />
							</IconButton>
							<div>
								<LoadingButton
									variant='contained'
									size='small'
									type='submit'
									loading={isLoading}
									disabled={isLoading || (!messageBody && !selectedImage)}
								>
									Publish Post
								</LoadingButton>
							</div>
						</div>
					</div>
				</form>
			)}

			{isOpen && (
				<div className='relative card bg-white p-4 z-20'>
					<div className='absolute top-1 right-1'>
						<Tooltip title='Close' onClick={toggleVisibility}>
							<IconButton>
								<CancelIcon size={20} />
							</IconButton>
						</Tooltip>
					</div>

					<h1 className='text-center text-lg lg:text-xl font-bold border-b border-gray-100 mb-3 pb-2'>
						Create post
					</h1>

					<div className='flex flex-wrap items-center mb-3'>
						<Avatar src={user?.avatar?.url} />
						<div className='ml-4'>
							<h3 className='text-base lg:text-lg font-medium'>{user?.fullName}</h3>
							<p className='flex flex-wrap text-gray-600 font-medium gap-1 items-center'>
								<PublicIcon fontSize={16} /> Public
							</p>
						</div>
					</div>

					<form onSubmit={submitForm}>
						<BasicInput
							textarea
							labelHide
							label="What's your mind?"
							onChange={e => setMessageBody(e.target.value)}
							value={messageBody}
							rows={4}
							className='text-base'
							inputRef={inputRef}
						/>
						<input
							ref={fileInputRef}
							type='file'
							hidden
							name='image'
							accept='image/*'
							onChange={onChange}
						/>

						{selectedImage ? (
							<div className='relative max-w-sm m-auto border-3 border-gray-300 rounded-2xl'>
								<div onClick={removeSelectedFile} className='absolute right-1 top-1'>
									<IconButton
										sx={{
											zIndex: 20,
											background: '#000',
											color: '#fff',
											'&:hover': {
												background: 'rgba(0, 0, 0, 0.7)',
											},
										}}
									>
										<CancelIcon size={15} />
									</IconButton>
								</div>
								<img
									className='rounded-2xl'
									src={URL.createObjectURL(selectedImage)}
									alt='post image'
								/>
							</div>
						) : null}

						<div className='flex flex-wrap mt-4 justify-between items-center'>
							<IconButton
								sx={{
									padding: '10px',
									color: theme => theme.palette.primary.main,
								}}
								onClick={onClick}
							>
								<HiPhotograph fontSize={30} />
							</IconButton>
							<LoadingButton
								variant='contained'
								type='submit'
								loading={isLoading}
								disabled={isLoading || (!messageBody && !selectedImage)}
							>
								Publish Post
							</LoadingButton>
						</div>
					</form>
				</div>
			)}
		</div>
	)
}
