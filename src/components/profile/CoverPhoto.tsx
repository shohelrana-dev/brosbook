"use client"
import React, {ChangeEvent, useState} from 'react'
import IconButton from "@components/common/IconButton"
import {TbCameraPlus} from "react-icons/tb"
import {useChangeCoverPhotoMutation} from "@services/usersApi"
import toast from "react-hot-toast"
import Button from "@components/common/Button"
import ImageLightbox from "@components/common/ImageLightbox"
import Image from "next/image"
import {User} from "@interfaces/user.interfaces"
import placeholderCoverPhoto from "@images/placeholder-cover-photo.png"
import useCurrentUser from "@hooks/useCurrentUser"
import Modal from "@components/common/Modal"
import useSelectFile from "@hooks/useSelectFile"

type Props = { user: User }

export default function CoverPhoto({user}: Props) {
    const {user: currentUser} = useCurrentUser()
    const [changeCoverPhoto, {isLoading}] = useChangeCoverPhotoMutation()
    const [coverPhoto, setCoverPhoto] = useState<string>(user.profile?.coverPhoto?.url!)
    const {inputRef, selectedFile: selectedPhoto, removeSelectedFile, onClick, onChange} = useSelectFile()

    const [isModalOpen, setIsModalOpen] = useState(false)

    function handleModalOpen() {
        setIsModalOpen(!isModalOpen)
    }

    async function handleSubmit() {
        if (!selectedPhoto) return

        try {
            const formData = new FormData()
            formData.append('coverPhoto', selectedPhoto)
            const data = await changeCoverPhoto(formData).unwrap()
            setIsModalOpen(false)
            removeSelectedFile()
            setCoverPhoto(data.profile?.coverPhoto?.url!)
            toast.success('Cover photo saved.')
        } catch (err: any) {
            console.error(err)
            toast.error(err?.data?.message || 'Something went wrong!, Please try again.')
        }
    }

    function fileInputChangeHandle(event: ChangeEvent<HTMLInputElement>) {
        onChange(event)
        setIsModalOpen(true)
    }

    if (user.id !== currentUser?.id) {
        return (
            <div className="relative w-full h-[300px]">
                {coverPhoto ? (
                    <ImageLightbox
                        className="absolute w-full h-full"
                        src={coverPhoto}
                        width={600}
                        height={300}
                        alt="cover photo"
                    />) : (
                    <Image src={placeholderCoverPhoto} className="absolute w-full h-full" width={600} height={300} alt='cover photo'/>
                )}
            </div>
        )
    }

    return (
        <div className="relative">
            <input hidden name="photo" type="file" accept="image/*" onChange={fileInputChangeHandle}
                   ref={inputRef}/>
            <div className="relative w-full h-[300px]">
                {coverPhoto ? (
                    <ImageLightbox
                        src={coverPhoto}
                        className="absolute w-full h-full"
                        width={600}
                        height={300}
                        alt="cover photo"
                    />) : (
                    <Image src={placeholderCoverPhoto} className="absolute w-full h-full" width={600} height={300} alt='cover photo'/>
                )}
            </div>

            <IconButton className="!absolute p-5 right-3 bottom-3 bg-gray-600 hover:bg-gray-700" onClick={onClick}>
                <TbCameraPlus fontSize={25} color="#fff"/>
            </IconButton>

            <Modal isOpen={isModalOpen} onClose={handleModalOpen} className="max-w-[625px] !p-3">
                <div>
                    <div className="flex justify-between p-2">
                        <h3 className="text-lg">New cover photo</h3>
                    </div>
                    <div className="p-4 bg-gray-100">
                        {selectedPhoto ? (
                            <div className="relative w-full h-[400px]">
                                <Image
                                    src={URL.createObjectURL(selectedPhoto)}
                                    alt="Cover photo"
                                    fill={true}
                                />
                            </div>
                        ) : null}
                    </div>
                    <div className="text-right mt-3">
                        <Button size="sm" isLoading={isLoading} className="mt-0" onClick={handleSubmit}>
                            Save
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
