"use client"
import React, {ChangeEvent, useRef, useState} from 'react'
import IconButton from "@components/common/IconButton"
import {TbCameraPlus} from "react-icons/tb"
import {useChangeProfilePhotoMutation} from "@services/usersApi"
import {toast} from "react-toastify"
import Button from "@components/common/Button"
import LightboxImage from "@components/common/LightboxImage"
import Image from "next/image"
import {User} from "@interfaces/user.interfaces"
import useAuth from "@hooks/useAuth"
import Modal from "@components/common/Modal"

type Props = { user: User }

export default function ProfilePhoto({user}: Props) {
    const {user: currentUser} = useAuth()
    const [changeProfilePhoto, {isLoading}] = useChangeProfilePhotoMutation()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [selectedPhoto, setSelectedPhoto] = useState<Blob>()
    const [profilePhoto, setProfilePhoto] = useState<string>(user.photo)

    const [isModalOpen, setIsModalOpen] = useState(false)

    function handleModalOpen(){
        setIsModalOpen(!isModalOpen)
    }

    async function handleSubmit() {
        if (!selectedPhoto) return

        try {
            const formData = new FormData()
            formData.append('photo', selectedPhoto)
            const data = await changeProfilePhoto(formData).unwrap()
            setIsModalOpen(false)
            setSelectedPhoto(undefined)
            setProfilePhoto(data.photo)
            toast.success('Profile photo was saved.')
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
            <LightboxImage
                src={profilePhoto}
                className="rounded-full w-[150px] h-[150px] mt-[-100px]"
                alt="User profile photo"
                width={150}
                height={150}
            />
        )
    }

    return (
        <div className="relative">
            <input hidden name="photo" type="file" accept="image/*" onChange={fileInputChangeHandle}
                   ref={inputRef}/>
            <LightboxImage
                src={profilePhoto}
                className="rounded-full w-[150px] h-[150px] mt-[-100px]"
                alt="User profile photo"
                width={150}
                height={150}
            />

            <IconButton className="!absolute p-3 right-3 bottom-0 bg-gray-600 hover:bg-gray-700" onClick={() => inputRef.current?.click()}>
                <TbCameraPlus fontSize={20} color="#fff"/>
            </IconButton>

            <Modal isOpen={isModalOpen} onClose={handleModalOpen} iconAlignment="left" className="max-w-[600px]">
                <div>
                    <div className="flex justify-between p-2">
                        <h3 className="text-lg ml-6">New profile photo</h3>
                        <Button size="sm" isLoading={isLoading} className="mt-0" onClick={handleSubmit}>
                            Save
                        </Button>
                    </div>
                    <div className="p-4 bg-gray-100">
                        {selectedPhoto ? (
                            <div className="relative w-full h-[450px]">
                                <Image
                                    src={URL.createObjectURL(selectedPhoto)}
                                    alt="User profile photo"
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