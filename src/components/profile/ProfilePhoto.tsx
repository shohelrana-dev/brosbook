'use client'
import Image from 'next/image'
import { useState } from 'react'
import { TbCameraPlus as CameraIcon } from 'react-icons/tb'
import Modal from 'react-minimal-modal'
import { toast } from 'sonner'
import Button from '~/components/ui/Button'
import IconButton from '~/components/ui/IconButton'
import Lightbox from '~/components/ui/Lightbox'
import useAuth from '~/hooks/useAuth'
import useSelectFile from '~/hooks/useSelectFile'
import { Media } from '~/interfaces/index.interfaces'
import { User } from '~/interfaces/user.interfaces'
import { useChangeProfilePhotoMutation } from '~/services/usersApi'

type Props = { user: User }

export default function ProfilePhoto({ user }: Props) {
	const { user: currentUser } = useAuth()
	const [changeProfilePhoto, { isLoading }] = useChangeProfilePhotoMutation()
	const [avatar, setAvatar] = useState<Media | undefined>(user.avatar)
	const { handleChange, handleClick, inputRef, selectedFile, removeSelectedFile } = useSelectFile()

	async function handleSubmit() {
		if (!selectedFile) return

		try {
			const formData = new FormData()
			formData.append('avatar', selectedFile)
			const data = await changeProfilePhoto(formData).unwrap()

			removeSelectedFile()
			setAvatar(data.avatar)
			toast.success('Profile photo saved.')
		} catch (err: any) {
			console.error(err)
			toast.error(err?.data?.message || 'Something went wrong!, Please try again.')
		}
	}

	if (user.id !== currentUser?.id) {
		return (
			<Lightbox>
				<a href={avatar?.url} target='__blank'>
					<Image
						src={avatar?.url!}
						alt='User profile photo'
						width={130}
						height={130}
						className='rounded-full w-[130px] h-[130px] mt-[-80px] border-4 border-white object-cover'
					/>
				</a>
			</Lightbox>
		)
	}

	return (
		<div className='relative'>
			<input
				hidden
				name='photo'
				type='file'
				accept='image/*'
				onChange={handleChange}
				ref={inputRef}
			/>
			<Lightbox>
				<a href={avatar?.url} target='__blank'>
					<Image
						src={avatar?.url!}
						alt='User profile photo'
						width={130}
						height={130}
						className='size-32 object-cover rounded-full mt-[-80px] border-4 border-white'
					/>
				</a>
			</Lightbox>

			<IconButton color='black' onClick={handleClick} className='absolute bottom-2 left-[10px]'>
				<CameraIcon fontSize={20} />
			</IconButton>

			<Modal open={!!selectedFile} toggle={removeSelectedFile} width={625}>
				<>
					<div className='text-center mb-3 max-w-[450px] m-auto'>
						<h4 className='text-2xl font-medium mb-2 text-gray-900'>Looking good!</h4>
						<p className='text-gray-800'>
							This photo will be added to your profile. It will also be seen by hosts or guest, so
							be sure it doesn’t include any personal or sensitive info.
						</p>
					</div>
					<div className='flex flex-wrap justify-center items-center my-5'>
						{!!selectedFile && (
							<Image
								src={URL.createObjectURL(selectedFile)}
								alt='Avatar'
								width={200}
								height={200}
								className='size-52 object-cover rounded-full'
							/>
						)}
					</div>
					<div className='mt-3'>
						<Button fullWidth isLoading={isLoading} onClick={handleSubmit}>
							Save
						</Button>
						<Button fullWidth variant='bordered' onClick={handleClick} className='mt-3'>
							Change Photo
						</Button>
					</div>
				</>
			</Modal>
		</div>
	)
}
