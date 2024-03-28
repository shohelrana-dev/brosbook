'use client'
import Image from 'next/image'
import { TbCameraPlus as CameraIcon } from 'react-icons/tb'
import Modal from 'react-minimal-modal'
import placeholderCoverPhoto from '~/assets/images/placeholder-cover-photo.png'
import Button from '~/components/global/Button'
import IconButton from '~/components/global/IconButton'
import Lightbox from '~/components/global/Lightbox'
import useSelectFile from '~/hooks/useSelectFile'
import useSession from '~/hooks/useSession'
import { User } from '~/interfaces/user.interfaces'
import { useChangeCoverPhotoMutation } from '~/services/usersApi'

type Props = { user: User }

export default function CoverPhoto({ user }: Props) {
    const { user: currentUser } = useSession()
    const [changeCoverPhoto, { isLoading }] = useChangeCoverPhotoMutation()
    const { inputRef, selectedFile, removeSelectedFile, handleClick, handleChange } = useSelectFile()

    async function handleSubmit() {
        if (!selectedFile) return

        const formData = new FormData()
        formData.append('coverPhoto', selectedFile)

        await changeCoverPhoto(formData).unwrap()
        removeSelectedFile()
    }

    const coverPhoto = user.profile?.coverPhoto

    if (user.id !== currentUser?.id) {
        return (
            <div className='flex-none'>
                {coverPhoto ? (
                    <Lightbox>
                        <a href={coverPhoto.url}>
                            <Image
                                src={coverPhoto.url}
                                width={600}
                                height={300}
                                alt='cover photo'
                                className='object-cover h-[200px] lg:h-[300px]'
                            />
                        </a>
                    </Lightbox>
                ) : (
                    <Image
                        src={placeholderCoverPhoto}
                        className='object-cover'
                        width={600}
                        height={300}
                        alt='cover photo'
                    />
                )}
            </div>
        )
    }

    return (
        <div className='flex-none relative'>
            <input
                hidden
                name='photo'
                type='file'
                accept='image/*'
                onChange={handleChange}
                ref={inputRef}
            />
            <div>
                {coverPhoto ? (
                    <Lightbox>
                        <a href={coverPhoto.url}>
                            <Image
                                src={coverPhoto.url}
                                width={600}
                                height={300}
                                className='object-cover h-[200px] lg:h-[300px]'
                                alt='cover photo'
                            />
                        </a>
                    </Lightbox>
                ) : (
                    <Image
                        src={placeholderCoverPhoto}
                        className='object-cover h-[300px]'
                        width={600}
                        height={300}
                        alt='cover photo'
                    />
                )}
            </div>

            <IconButton
                onClick={handleClick}
                className='absolute bottom-2 right-[10px] bg-black hover:!bg-black/70 text-white'
            >
                <CameraIcon fontSize={25} />
            </IconButton>

            <Modal open={!!selectedFile} toggle={removeSelectedFile} className='max-w-screen-sm'>
                <>
                    <h3 className='text-xl font-medium text-gray-900 text-center'>Choose cover photo</h3>
                    {selectedFile ? (
                        <Image
                            src={URL.createObjectURL(selectedFile)}
                            alt='Cover photo'
                            height={200}
                            width={500}
                            className='h-[200px] w-full object-cover my-5'
                        />
                    ) : null}
                    <div className='mt-3'>
                        <Button isLoading={isLoading} fullWidth onClick={handleSubmit}>
                            Save
                        </Button>
                        <Button
                            color='primary'
                            variant='bordered'
                            radius='full'
                            fullWidth
                            onClick={handleClick}
                            className='mt-3'
                        >
                            Change Photo
                        </Button>
                    </div>
                </>
            </Modal>
        </div>
    )
}
