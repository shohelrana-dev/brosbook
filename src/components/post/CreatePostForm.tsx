'use client'
import { FormEvent, useState } from 'react'
import { MdPublic as PublicIcon } from 'react-icons/md'
import { HiPhotograph } from 'react-icons/hi'
import { RxCross2 as CancelIcon } from 'react-icons/rx'
import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'
import { IconButton } from '@mui/material'

import Avatar from '@components/global/Avatar'
import { useCreatePostMutation } from '@services/postsApi'
import BasicInput from '@components/form/BasicInput'
import useAuthState from '@hooks/useAuthState'
import useSelectFile from '@hooks/useSelectFile'
import Modal, { useModal } from 'react-minimal-modal'

export default function CreatePostForm() {
    //hooks
    const { user, isAuthenticated } = useAuthState()
    const [createPost, { isLoading }] = useCreatePostMutation()
    const [messageBody, setMessageBody] = useState<string>('')
    const { inputRef: fileInputRef, selectedFile: selectedImage, removeSelectedFile, onChange, onClick } = useSelectFile()
    const { toggle, isVisible } = useModal()

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
        <>
            <form
                onSubmit={submitForm}
                className='box mb-5 px-4 py-6 pt-8 flex'
            >
                <Avatar
                    src={user?.avatar?.url}
                    size='small'
                />
                <span className='inline-block mr-3' />
                <div className='flex-grow'>
                    <BasicInput
                        label="What's your mind?"
                        labelHide
                        onChange={e => setMessageBody(e.target.value)}
                        value={isVisible ? '' : messageBody}
                        onFocus={toggle}
                        className='focus:border-gray-200'
                        textarea
                    />
                    <div className='flex flex-wrap justify-between items-center'>
                        <IconButton
                            sx={{
                                padding: '10px',
                                marginTop: '-10px',
                                color: theme => theme.palette.themeGreen,
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

            <Modal
                visible={isVisible}
                toggle={toggle}
                position='top'
                width={600}
                className='mt-16'
            >
                <div>
                    <h1 className='text-center text-lg lg:text-xl font-bold border-b border-gray-100 mb-3 pb-2 -mt-4'>
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
                            autoFocus
                            className='text-base'
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
                                <div
                                    onClick={removeSelectedFile}
                                    className='absolute right-1 top-1'
                                >
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
                                    color: theme => theme.palette.themeGreen,
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
            </Modal>
        </>
    )
}
