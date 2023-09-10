"use client"
import React, { ChangeEvent, useState } from 'react'
import { IconButton } from '@mui/material'
import { TbCameraPlus } from "react-icons/tb"
import { useChangeCoverPhotoMutation } from "@services/usersApi"
import toast from "react-hot-toast"
import ImageLightbox from "@components/global/ImageLightbox"
import Image from "next/image"
import { User } from "@interfaces/user.interfaces"
import placeholderCoverPhoto from "@assets/images/placeholder-cover-photo.png"
import useAuthState from "@hooks/useAuthState"
import Modal from "react-minimal-modal"
import useSelectFile from "@hooks/useSelectFile"
import { Media } from "@interfaces/index.interfaces"
import { LoadingButton } from '@mui/lab'
import { Button } from '@mui/material'

type Props = { user: User }

export default function CoverPhoto( { user }: Props ) {
    const { user: currentUser }                                                            = useAuthState()
    const [ changeCoverPhoto, { isLoading } ]                                              = useChangeCoverPhotoMutation()
    const [ coverPhoto, setCoverPhoto ]                                                    = useState<Media | undefined>(user.profile?.coverPhoto)
    const { inputRef, selectedFile: selectedPhoto, removeSelectedFile, onClick, onChange } = useSelectFile()

    async function handleSubmit() {
        if ( !selectedPhoto ) return

        try {
            const formData = new FormData()
            formData.append('coverPhoto', selectedPhoto)
            const data = await changeCoverPhoto(formData).unwrap()

            removeSelectedFile()
            setCoverPhoto(data.profile?.coverPhoto)
            toast.success('Cover photo saved.')
        } catch ( err: any ) {
            console.error(err)
            toast.error(err?.data?.message || 'Something went wrong!, Please try again.')
        }
    }

    function fileInputChangeHandle( event: ChangeEvent<HTMLInputElement> ) {
        onChange(event)
    }

    if ( user.id !== currentUser?.id ) {
        return (
            <div className="flex-none">
                { coverPhoto ? (
                    <ImageLightbox
                        className="object-cover h-[300px]"
                        image={ coverPhoto }
                        width={ 600 }
                        height={ 300 }
                        alt="cover photo"
                    /> ) : (
                    <Image src={ placeholderCoverPhoto } className="object-cover" width={ 600 } height={ 300 }
                           alt='cover photo'/>
                ) }
            </div>
        )
    }

    return (
        <div className="flex-none relative">
            <input hidden name="photo" type="file" accept="image/*" onChange={ fileInputChangeHandle }
                   ref={ inputRef }/>
            <div>
                { coverPhoto ? (
                    <ImageLightbox
                        image={ coverPhoto }
                        width={ 600 }
                        height={ 300 }
                        className="object-cover !h-[200px] !lg:h-[300px]"
                        alt="cover photo"
                    /> ) : (
                    <Image src={ placeholderCoverPhoto } className="object-cover h-[300px]" width={ 600 } height={ 300 }
                           alt='cover photo'/>
                ) }
            </div>

            <IconButton
                onClick={ onClick }
                sx={ {
                    position: 'absolute',
                    bottom: '8px',
                    right: '10px',
                    background: 'rgba(0, 0, 0, 0.9)',
                    '&:hover': { background: 'rgba(0, 0, 0, 0.7)' }
                } }
            >
                <TbCameraPlus fontSize={ 25 } color="#fff"/>
            </IconButton>

            <Modal
                visible={ !!selectedPhoto }
                toggle={ removeSelectedFile }
                className="max-w-[625px] !p-3 max-h-screen"
            >
                <>
                    <h3 className="text-xl font-medium text-gray-900 text-center">Choose cover photo</h3>
                    <div className="relative h-[250px] w-full overflow-hidden my-5">
                        { selectedPhoto ? (
                            <Image
                                src={ URL.createObjectURL(selectedPhoto) }
                                alt="Cover photo"
                                fill={ true }
                            />
                        ) : null }
                    </div>
                    <div className="mt-3">
                        <LoadingButton variant="contained" size="large" loading={ isLoading } fullWidth onClick={ handleSubmit }>
                            Save
                        </LoadingButton>
                        <Button variant="outlined" size="large" sx={{ marginTop: '12px' }} fullWidth onClick={ onClick }>
                            Change Photo
                        </Button>
                    </div>
                </>
            </Modal>
        </div>
    )
}
