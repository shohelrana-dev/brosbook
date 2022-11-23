"use client"
import React, {ChangeEvent, useRef, useState} from 'react'
import IconButton from "@components/common/IconButton"
import {TbCameraPlus} from "react-icons/tb"
import {useChangeCoverPhotoMutation} from "@services/usersApi"
import {toast} from "react-toastify"
import Button from "@components/common/Button"
import ImageLightbox from "@components/common/ImageLightbox"
import Image from "next/image"
import {User} from "@interfaces/user.interfaces"
import placeholderCoverPhoto from "@images/placeholder-cover-photo.png"
import useUser from "@hooks/useUser"
import Modal from "@components/common/Modal"

type Props = { user: User }

export default function CoverPhoto({user}: Props) {
    const {user: currentUser} = useUser()
    const [changeCoverPhoto, {isLoading}] = useChangeCoverPhotoMutation()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [selectedPhoto, setSelectedPhoto] = useState<Blob>()
    const [coverPhoto, setCoverPhoto] = useState<string>(user.profile?.coverPhoto!)

    const [isModalOpen, setIsModalOpen] = useState(false)

    function handleModalOpen(){
        setIsModalOpen(!isModalOpen)
    }

    async function handleSubmit() {
        if (!selectedPhoto) return

        try {
            const formData = new FormData()
            formData.append('photo', selectedPhoto)
            const data = await changeCoverPhoto(formData).unwrap()
            setIsModalOpen(false)
            setSelectedPhoto(undefined)
            setCoverPhoto(data.profile?.coverPhoto!)
            toast.success('Cover photo was saved.')
        } catch (err: any) {
            console.error(err)
            toast.error(err?.data?.message || 'Something went wrong!, Please try again.')
        }
    }

    function fileInputChangeHandle(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedPhoto(event.target.files[0])
            setIsModalOpen(true)
        }
    }

    if (user.id !== currentUser?.id) {
        return (
            <div className="relative w-full h-[320px]">
                {coverPhoto ? (
                    <ImageLightbox
                        src={coverPhoto}
                        fill={true}
                        alt="cover photo"
                    />) : (
                    <Image src={placeholderCoverPhoto} fill={true} alt='cover photo'/>
                )}
            </div>
        )
    }

    return (
        <div className="relative">
            <input hidden name="photo" type="file" accept="image/*" onChange={fileInputChangeHandle}
                   ref={inputRef}/>
            <div className="relative w-full h-[320px]">
                {coverPhoto ? (
                    <ImageLightbox
                        src={coverPhoto}
                        fill={true}
                        alt="cover photo"
                    />) : (
                    <Image src={placeholderCoverPhoto} fill={true} alt='cover photo'/>
                )}
            </div>

            <IconButton className="!absolute p-5 right-3 bottom-3 bg-gray-600 hover:bg-gray-700"
                        onClick={() => inputRef.current?.click()}>
                <TbCameraPlus fontSize={25} color="#fff"/>
            </IconButton>

            <Modal isOpen={isModalOpen} onClose={handleModalOpen} iconAlignment="left" className="max-w-[625px] !p-3">
                <div>
                    <div className="flex justify-between p-2">
                        <h3 className="text-lg ml-6">New cover photo</h3>
                        <Button size="sm" isLoading={isLoading} className="mt-0" onClick={handleSubmit}>
                            Save
                        </Button>
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
                </div>
            </Modal>
        </div>
    )
}
