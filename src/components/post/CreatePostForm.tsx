'use client'
import { FormEvent, useEffect, useState } from 'react'
import { MdPublic as PublicIcon } from 'react-icons/md'
import { HiPhotograph } from 'react-icons/hi'
import { RxCross2 as CancelIcon } from 'react-icons/rx'
import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'
import { IconButton, Tooltip } from '@mui/material'
import { useModal } from 'react-minimal-modal'
import { twMerge } from 'tailwind-merge'

import Avatar from '@components/global/Avatar'
import { useCreatePostMutation } from '@services/postsApi'
import BasicInput from '@components/form/BasicInput'
import useAuthState from '@hooks/useAuthState'
import useSelectFile from '@hooks/useSelectFile'
import useFocus from '@hooks/useFocus'

export default function CreatePostForm() {
	//hooks
	const { user, isAuthenticated } = useAuthState()
	const [createPost, { isLoading }] = useCreatePostMutation()
	const [messageBody, setMessageBody] = useState<string>('')
	const {
		inputRef: fileInputRef,
		selectedFile: selectedImage,
		removeSelectedFile,
		onChange,
		onClick,
	} = useSelectFile()
	const { toggle, isVisible } = useModal()
	const { inputRef, focus } = useFocus()

	useEffect(() => {
		if (isVisible) focus()
	}, [isVisible])

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
		<div className='relative mb-5'>
			<div
				className={twMerge(
					'fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.3)] z-10 opacity-0 duration-300 invisible',
					isVisible && 'opacity-100 visible'
				)}
				onClick={isVisible ? toggle : undefined}
			/>

			{!isVisible && (
				<form onSubmit={submitForm} className='box px-4 py-6 pt-8 flex z-10 relative'>
					<Avatar src={user?.avatar?.url} size='small' />
					<span className='inline-block mr-3' />
					<div className='flex-grow'>
						<BasicInput
							label="What's your mind?"
							labelHide
							onChange={e => setMessageBody(e.target.value)}
							value={isVisible ? '' : messageBody}
							onFocus={toggle}
							className='focus:border-gray-200'
						/>
						<div className='flex flex-wrap justify-between items-center'>
							<IconButton
								sx={{
									padding: '10px',
									marginTop: '-10px',
									color: theme => theme.palette.primary.main,
								}}
								disabled
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

			<div
				className={twMerge(
					'box bg-white p-4 max-h-[250px] overflow-hidden absolute top-0 left-0 opacity-0 duration-500',
					isVisible && 'relative opacity-100 max-h-[1600px] z-50'
				)}
			>
				<div className='absolute top-1 right-1'>
					<Tooltip title='Close' onClick={toggle}>
						<IconButton>
							<CancelIcon size={18} />
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
						<div className='relative max-w-sm m-auto border-3 border-solid border-gray-300 rounded-2xl'>
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
		</div>
	)
}
