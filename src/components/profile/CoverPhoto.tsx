"use client"
import React, { ChangeEvent, useState } from 'react'
import IconButton from "@components/global/IconButton"
import { TbCameraPlus } from "react-icons/tb"
import { useChangeCoverPhotoMutation } from "@services/usersApi"
import toast from "react-hot-toast"
import Button from "@components/global/Button"
import ImageLightbox from "@components/global/ImageLightbox"
import Image from "next/image"
import { User } from "@interfaces/user.interfaces"
import placeholderCoverPhoto from "@images/placeholder-cover-photo.png"
import useAuthState from "@hooks/useAuthState"
import Modal from "@components/global/Modal"
import useSelectFile from "@hooks/useSelectFile"
import { Media } from "@interfaces/index.interfaces"

type Props = { user: User }

export default function CoverPhoto( { user }: Props ){
    const { user: currentUser }                                                            = useAuthState()
    const [changeCoverPhoto, { isLoading }]                                                = useChangeCoverPhotoMutation()
    const [coverPhoto, setCoverPhoto]                                                      = useState<Media | undefined>( user.profile?.coverPhoto )
    const { inputRef, selectedFile: selectedPhoto, removeSelectedFile, onClick, onChange } = useSelectFile()

    const [isModalOpen, setIsModalOpen] = useState( false )

    function handleModalOpen(){
        setIsModalOpen( ! isModalOpen )
    }

    async function handleSubmit(){
        if( ! selectedPhoto ) return

        try {
            const formData = new FormData()
            formData.append( 'coverPhoto', selectedPhoto )
            const data = await changeCoverPhoto( formData ).unwrap()
            setIsModalOpen( false )
            removeSelectedFile()
            setCoverPhoto( data.profile?.coverPhoto )
            toast.success( 'Cover photo saved.' )
        } catch ( err: any ) {
            console.error( err )
            toast.error( err?.data?.message || 'Something went wrong!, Please try again.' )
        }
    }

    function fileInputChangeHandle( event: ChangeEvent<HTMLInputElement> ){
        onChange( event )
        setIsModalOpen( true )
    }

    if( user.id !== currentUser?.id ){
        return (
            <div className="relative w-full h-[300px]">
                { coverPhoto ? (
                    <ImageLightbox
                        className="absolute w-full h-full"
                        image={ coverPhoto }
                        width={ 600 }
                        height={ 300 }
                        alt="cover photo"
                    /> ) : (
                    <Image src={ placeholderCoverPhoto } className="absolute w-full h-full" width={ 600 } height={ 300 }
                           alt='cover photo'/>
                ) }
            </div>
        )
    }

    return (
        <div className="relative">
            <input hidden name="photo" type="file" accept="image/*" onChange={ fileInputChangeHandle }
                   ref={ inputRef }/>
            <div className="relative w-full h-[300px]">
                { coverPhoto ? (
                    <ImageLightbox
                        image={ coverPhoto }
                        className="absolute w-full h-full"
                        width={ 600 }
                        height={ 300 }
                        alt="cover photo"
                    /> ) : (
                    <Image src={ placeholderCoverPhoto } className="absolute w-full h-full" width={ 600 } height={ 300 }
                           alt='cover photo'/>
                ) }
            </div>

            <IconButton className="!absolute p-5 right-3 bottom-3 bg-gray-600 hover:bg-gray-700" onClick={ onClick }>
                <TbCameraPlus fontSize={ 25 } color="#fff"/>
            </IconButton>

            <Modal
                isOpen={ isModalOpen }
                onClose={ handleModalOpen }
                title="New cover photo"
                className="max-w-[625px] !p-3 max-h-screen"
            >
                <>
                    <div className="p-4 bg-gray-100 max-h-[75vh] overflow-hidden">
                        { selectedPhoto ? (
                            <div>
                                <Image
                                    src={ URL.createObjectURL( selectedPhoto ) }
                                    alt="Cover photo"
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
