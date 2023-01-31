"use client"
import React, {useState} from 'react'
import IconButton from "@components/common/IconButton"
import {TbCameraPlus} from "react-icons/tb"
import {useChangeProfilePhotoMutation} from "@services/usersApi"
import toast from "react-hot-toast"
import Button from "@components/common/Button"
import ImageLightbox from "@components/common/ImageLightbox"
import Image from "next/image"
import {User} from "@interfaces/user.interfaces"
import useAuthState from "@hooks/useAuthState"
import Modal from "@components/common/Modal"
import useSelectFile from "@hooks/useSelectFile"
import { Media } from "@interfaces/index.interfaces"

type Props = { user: User }

export default function ProfilePhoto({user}: Props) {
    const {user: currentUser} = useAuthState()
    const [changeProfilePhoto, {isLoading}] = useChangeProfilePhotoMutation()
    const [avatar, setAvatar] = useState<Media  | undefined>(user.avatar)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const {onChange, onClick, inputRef, selectedFile: selectedPhoto, removeSelectedFile} = useSelectFile()

    function handleModalOpen() {
        if(isModalOpen){
            removeSelectedFile()
        }
        setIsModalOpen(!isModalOpen)
    }

    async function handleSubmit() {
        if (!selectedPhoto) return

        try {
            const formData = new FormData()
            formData.append('avatar', selectedPhoto)
            const data = await changeProfilePhoto(formData).unwrap()

            setIsModalOpen(false)
            removeSelectedFile()
            setAvatar(data.avatar)
            toast.success('Profile photo saved.')
        } catch (err: any) {
            console.error(err)
            toast.error(err?.data?.message || 'Something went wrong!, Please try again.')
        }
    }

    if (user.id !== currentUser?.id) {
        return (
            <ImageLightbox
                image={avatar}
                className="rounded-full w-[130px] h-[130px] mt-[-80px] border-4 border-white"
                alt="User profile photo"
                width={130}
                height={130}
            />
        )
    }

    return (
        <div className="relative">
            <input hidden name="photo" type="file" accept="image/*" onChange={(event) => {
                onChange(event);
                setIsModalOpen(true)
            }}
                   ref={inputRef}/>
            <ImageLightbox
                image={avatar}
                className="rounded-full w-[130px] h-[130px] mt-[-80px] border-4 border-white"
                alt="User profile photo"
                width={130}
                height={130}
            />

            <IconButton className="!absolute p-3 right-3 bottom-0 bg-gray-600 hover:bg-gray-700" onClick={onClick}>
                <TbCameraPlus fontSize={20} color="#fff"/>
            </IconButton>

            <Modal isOpen={isModalOpen} onClose={handleModalOpen} className="max-w-[625px] !p-3">
                <div>
                    <div className="p-2">
                        <h3 className="text-xl mb-2">New profile photo</h3>
                    </div>
                    <div className="p-4 bg-gray-100">
                        {selectedPhoto ? (
                            <div>
                                <Image
                                    src={URL.createObjectURL(selectedPhoto)}
                                    alt="User profile photo"
                                    width={570}
                                    height={400}
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