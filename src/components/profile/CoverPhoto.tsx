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
import placeholderCoverPhoto from "@assets/images/placeholder-cover-photo.png"
import useAuthState from "@hooks/useAuthState"
import Modal, { useModal } from "react-minimal-modal"
import useSelectFile from "@hooks/useSelectFile"
import { Media } from "@interfaces/index.interfaces"

type Props = { user: User }

export default function CoverPhoto( { user }: Props ){
    const { user: currentUser }                                                            = useAuthState()
    const [changeCoverPhoto, { isLoading }]                                                = useChangeCoverPhotoMutation()
    const [coverPhoto, setCoverPhoto]                                                      = useState<Media | undefined>( user.profile?.coverPhoto )
    const { inputRef, selectedFile: selectedPhoto, removeSelectedFile, onClick, onChange } = useSelectFile()
    const { isVisible, toggle }                                                            = useModal()

    async function handleSubmit(){
        if( ! selectedPhoto ) return

        try {
            const formData = new FormData()
            formData.append( 'coverPhoto', selectedPhoto )
            const data = await changeCoverPhoto( formData ).unwrap()
            toggle()
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
        toggle()
    }

    if( user.id !== currentUser?.id ){
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
                        className="object-cover h-[300px]"
                        alt="cover photo"
                    /> ) : (
                    <Image src={ placeholderCoverPhoto } className="object-cover h-[300px]" width={ 600 } height={ 300 }
                           alt='cover photo'/>
                ) }
            </div>

            <IconButton className="!absolute p-5 right-3 bottom-3 bg-gray-600 hover:bg-gray-700" onClick={ onClick }>
                <TbCameraPlus fontSize={ 25 } color="#fff"/>
            </IconButton>

            <Modal
                visible={ isVisible }
                toggle={ toggle }
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
