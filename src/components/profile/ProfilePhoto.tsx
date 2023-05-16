"use client"
import React, { ChangeEvent, useState } from 'react'
import IconButton from "@components/global/IconButton"
import { TbCameraPlus } from "react-icons/tb"
import { useChangeProfilePhotoMutation } from "@services/usersApi"
import toast from "react-hot-toast"
import Button from "@components/global/Button"
import ImageLightbox from "@components/global/ImageLightbox"
import Image from "next/image"
import { User } from "@interfaces/user.interfaces"
import useAuthState from "@hooks/useAuthState"
import Modal, { useModal } from "react-minimal-modal"
import useSelectFile from "@hooks/useSelectFile"
import { Media } from "@interfaces/index.interfaces"
import ButtonOutline from "@components/global/ButtonOutline";

type Props = { user: User }

export default function ProfilePhoto( { user }: Props ) {
    const { user: currentUser }                                                            = useAuthState()
    const [changeProfilePhoto, { isLoading }]                                              = useChangeProfilePhotoMutation()
    const [avatar, setAvatar]                                                              = useState<Media | undefined>( user.avatar )
    const { onChange, onClick, inputRef, selectedFile: selectedPhoto, removeSelectedFile } = useSelectFile()
    const { isVisible, toggle }                                                            = useModal()

    async function handleSubmit() {
        if ( !selectedPhoto ) return

        try {
            const formData = new FormData()
            formData.append( 'avatar', selectedPhoto )
            const data = await changeProfilePhoto( formData ).unwrap()

            toggle()
            removeSelectedFile()
            setAvatar( data.avatar )
            toast.success( 'Profile photo saved.' )
        } catch ( err: any ) {
            console.error( err )
            toast.error( err?.data?.message || 'Something went wrong!, Please try again.' )
        }
    }

    function handleInputChange( event: ChangeEvent<HTMLInputElement> ) {
        onChange( event )
    }

    if ( user.id !== currentUser?.id ) {
        return (
            <ImageLightbox
                image={ avatar }
                className="rounded-full w-[130px] h-[130px] mt-[-80px] border-4 border-white object-cover"
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
                className="rounded-full w-[130px] h-[130px] mt-[-80px] border-4 border-white object-cover"
                alt="User profile photo"
                width={ 130 }
                height={ 130 }
            />

            <IconButton className="!absolute p-3 right-3 bottom-0 bg-gray-600 hover:bg-gray-700" onClick={ () => {
                onClick()
                toggle()
            } }>
                <TbCameraPlus fontSize={ 20 } color="#fff"/>
            </IconButton>

            <Modal
                visible={ isVisible }
                toggle={ toggle }
                className="max-w-[625px] !p-3"
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
                    <div className="flex justify-center items-center my-5">
                        <div
                            className="relative p-4 overflow-hidden h-[200px] w-[200px] rounded-full">
                            { selectedPhoto ? (
                                <Image
                                    src={ URL.createObjectURL( selectedPhoto ) }
                                    alt="Avatar"
                                    fill={ true }
                                />
                            ) : null }
                        </div>
                    </div>
                    <div className="mt-3">
                        <Button size="md" isLoading={ isLoading } fullWidth onClick={ handleSubmit }>
                            Save
                        </Button>
                        <ButtonOutline size="md" className="mt-3" fullWidth onClick={ onClick }>
                            Change Photo
                        </ButtonOutline>
                    </div>
                </>
            </Modal>
        </div>
    )
}