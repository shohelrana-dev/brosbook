"use client"
import React, { ChangeEvent, useState } from 'react'
import { IconButton } from '@mui/material'
import { TbCameraPlus } from "react-icons/tb"
import { useChangeProfilePhotoMutation } from "@services/usersApi"
import toast from "react-hot-toast"
import ImageLightbox from "@components/global/ImageLightbox"
import Image from "next/image"
import { User } from "@interfaces/user.interfaces"
import useAuthState from "@hooks/useAuthState"
import Modal from "react-minimal-modal"
import useSelectFile from "@hooks/useSelectFile"
import { Media } from "@interfaces/index.interfaces"
import { LoadingButton } from "@mui/lab"
import { Button } from "@mui/material"

type Props = { user: User }

export default function ProfilePhoto( { user }: Props ) {
    const { user: currentUser }                                                            = useAuthState()
    const [ changeProfilePhoto, { isLoading } ]                                            = useChangeProfilePhotoMutation()
    const [ avatar, setAvatar ]                                                            = useState<Media | undefined>(user.avatar)
    const { onChange, onClick, inputRef, selectedFile: selectedPhoto, removeSelectedFile } = useSelectFile()

    async function handleSubmit() {
        if ( !selectedPhoto ) return

        try {
            const formData = new FormData()
            formData.append('avatar', selectedPhoto)
            const data = await changeProfilePhoto(formData).unwrap()

            removeSelectedFile()
            setAvatar(data.avatar)
            toast.success('Profile photo saved.')
        } catch ( err: any ) {
            console.error(err)
            toast.error(err?.data?.message || 'Something went wrong!, Please try again.')
        }
    }

    function handleInputChange( event: ChangeEvent<HTMLInputElement> ) {
        onChange(event)
    }

    if ( user.id !== currentUser?.id ) {
        return (
            <ImageLightbox
                image={ avatar }
                className="rounded-full w-[130px] !h-[130px] mt-[-80px] border-4 border-solid border-white object-cover"
                alt="User profile photo"
                width={ 130 }
                height={ 130 }
            />
        )
    }

    return (
        <div className="relative">
            <input hidden name="photo" type="file" accept="image/*" onChange={ handleInputChange } ref={ inputRef }/>
            <ImageLightbox
                image={ avatar }
                className="size-32 object-cover rounded-full mt-[-80px] border-4 border-solid border-white"
                alt="User profile photo"
                width={ 130 }
                height={ 130 }
            />

            <IconButton
                onClick={ onClick }
                sx={ {
                    position: 'absolute',
                    bottom:'8px',
                    right: '10px',
                    background: 'rgba(0, 0, 0, 0.9)',
                    '&:hover': { background: 'rgba(0, 0, 0, 0.7)' }
                } }
            >
                <TbCameraPlus fontSize={ 20 } color="#fff"/>
            </IconButton>

            <Modal
                visible={ !!selectedPhoto }
                toggle={ removeSelectedFile }
                width={625}
            >
                <>
                    <div className="text-center mb-3 max-w-[450px] m-auto">
                        <h4 className="text-2xl font-medium mb-2 text-gray-900">Looking good!</h4>
                        <p className="text-gray-800">
                            This photo will be added to your profile. It will also be seen by hosts or guest, so be sure
                            it
                            doesn’t include any personal or sensitive info.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center items-center my-5">
                        { selectedPhoto ? (
                            <Image
                                src={ URL.createObjectURL(selectedPhoto) }
                                alt="Avatar"
                                width={200}
                                height={200}
                                className="size-52 object-cover rounded-full"
                            />
                        ) : null }
                    </div>
                    <div className="mt-3">
                        <LoadingButton variant="contained" fullWidth size="large" loading={ isLoading } onClick={ handleSubmit }>
                            Save
                        </LoadingButton>
                        <Button variant="outlined" fullWidth  sx={{ marginTop: '12px' }} size="large" onClick={ onClick }>
                            Change Photo
                        </Button>
                    </div>
                </>
            </Modal>
        </div>
    )
}