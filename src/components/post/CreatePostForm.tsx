'use client'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { MdPublic as PublicIcon } from 'react-icons/md'
import { HiPhotograph } from 'react-icons/hi'
import { RxCross2 as CancelIcon } from 'react-icons/rx'
import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'
import { IconButton } from '@mui/material'

import Avatar from '@components/global/Avatar'
import { useCreatePostMutation } from '@services/postsApi'
import BasicInput from '@components/global/BasicInput'
import useAuthState from '@hooks/useAuthState'
import useSelectFile from '@hooks/useSelectFile'
import Modal, { useModal } from 'react-minimal-modal'

export default function CreatePostForm() {
    //hooks
    const { user, isAuthenticated } = useAuthState()
    const [createPost, { isLoading }] = useCreatePostMutation()
    const [body, setBody] = useState<string>('')
    const {
        inputRef: fileInputRef,
        selectedFile: selectedImage,
        removeSelectedFile,
        onChange,
        onClick,
    } = useSelectFile()
    const { toggle, isVisible } = useModal()
    const inputRef = useRef<HTMLInputElement>()

    useEffect(() => {
        if (isVisible) {
            inputRef.current?.focus()
        }
    }, [inputRef, isVisible])

    async function submitForm(event: FormEvent) {
        event.preventDefault()

        if (!body && !selectedImage) return

        const formData = new FormData()
        if (body) {
            formData.append('body', body)
        }
        if (selectedImage) {
            formData.append('image', selectedImage)
        }

        try {
            await createPost(formData).unwrap()
            toast.success('Post published.')
            if (body) setBody('')
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
                className='box mb-5 p-3 flex'
            >
                <Avatar
                    src={user?.avatar?.url}
                    size='small'
                />
                <span className='inline-block mr-3'/>
                <BasicInput
                    label="What's your mind?"
                    labelHide
                    onChange={e => setBody(e.target.value)}
                    onFocus={toggle}
                    className='focus:border-gray-200'
                    wrapperClassname='flex-grow !mb-0'
                />
            </form>

            <Modal
                visible={isVisible}
                toggle={toggle}
            >
                <div>
                    <h1 className='text-center text-lg lg:text-xl font-bold border-b border-gray-100 mb-4 pb-2 -mt-4'>
                        Create post
                    </h1>
                    <div className='flex flex-wrap items-center mb-3'>
                        <Avatar src={user?.avatar?.url} />
                        <div className='ml-4'>
                            <h3 className='text-base lg:text-lg font-medium'>
                                {user?.fullName}
                            </h3>
                            <p className='flex flex-wrap text-gray-600 font-medium gap-1 items-center'>
                                <PublicIcon fontSize={16} /> Public
                            </p>
                        </div>
                    </div>
                    <form onSubmit={submitForm}>
                        <BasicInput
                            inputRef={inputRef}
                            textarea
                            labelHide
                            label="What's your mind?"
                            onChange={e => setBody(e.target.value)}
                            value={body}
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
                                                background:
                                                    'rgba(0, 0, 0, 0.7)',
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
                                disabled={
                                    isLoading || (!body && !selectedImage)
                                }
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
