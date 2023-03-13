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
import Modal from "@components/global/Modal"
import useSelectFile from "@hooks/useSelectFile"
import { Media } from "@interfaces/index.interfaces"
import useModal from "@hooks/useModal"

type Props = { user: User }

export default function ProfilePhoto( { user }: Props ){
    const { user: currentUser }                                                            = useAuthState()
    const [changeProfilePhoto, { isLoading }]                                              = useChangeProfilePhotoMutation()
    const [avatar, setAvatar]                                                              = useState<Media | undefined>( user.avatar )
    const { onChange, onClick, inputRef, selectedFile: selectedPhoto, removeSelectedFile } = useSelectFile()
    const { isVisible, toggle }                                                            = useModal()

    async function handleSubmit(){
        if( ! selectedPhoto ) return

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

    function handleInputChange( event: ChangeEvent<HTMLInputElement> ){
        onChange( event )
        toggle()
    }

    if( user.id !== currentUser?.id ){
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

            <IconButton className="!absolute p-3 right-3 bottom-0 bg-gray-600 hover:bg-gray-700" onClick={ onClick }>
                <TbCameraPlus fontSize={ 20 } color="#fff"/>
            </IconButton>

            <Modal
                isVisible={ isVisible }
                toggle={ toggle }
                title="New profile photo"
                className="max-w-[625px] !p-3"
            >
                <>
                    <div className="p-4 bg-gray-100 max-h-[75vh] overflow-hidden">
                        { selectedPhoto ? (
                            <div>
                                <Image
                                    src={ URL.createObjectURL( selectedPhoto ) }
                                    alt="User profile photo"
                                    width={ 570 }
                                    height={ 400 }
                                />
                            </div>
                        ) : null }
                    </div>
                    <div className="text-right mt-3">
                        <Button size="md" isLoading={ isLoading } className="mt-0" onClick={ handleSubmit }>
                            Save
                        </Button>
                    </div>
                </>
            </Modal>
        </div>
    )
}