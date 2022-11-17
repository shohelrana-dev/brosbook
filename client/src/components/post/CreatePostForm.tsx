import React, {ChangeEvent, FormEvent, useRef, useState} from 'react'
import {MdPublic} from "react-icons/md"
import {HiPhotograph} from "react-icons/hi"
import {ImCross} from 'react-icons/im'
import {toast} from "react-toastify"

import Avatar from "@components/common/Avatar"
import {useCreatePostMutation} from "@services/postsApi"
import BasicInput from "@components/common/BasicInput"
import Button from "@components/common/Button"
import useAuth from "@hooks/useAuth"
import IconButton from "@components/common/IconButton"

function CreatePostForm() {
    //hooks
    const {user} = useAuth()
    const [createPost, {isLoading}] = useCreatePostMutation()
    const inputImageRef = useRef<HTMLInputElement | null>(null)
    const [selectedImage, setSelectedImage] = useState<any>(null)
    const [body, setBody] = useState<string>('')

    async function submitForm(event: FormEvent) {
        event.preventDefault()

        if (!body && !selectedImage) return

        const formData = new FormData()
        formData.append('body', body)
        formData.append('image', selectedImage)

        try {
            await createPost(formData).unwrap()
            toast.success('Post has been published.')
            if (body) setBody('')
            if (selectedImage) setSelectedImage(null)
        } catch (err: any) {
            console.error(err)
            toast.error('Post couldn\'t be saved.')
        }
    }

    function fileInputChangeHandle(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedImage(event.target.files[0])
        }
    }

    return (
        <div className="relative box p-6">
            <h1 className="text-center text-xl font-bold border-b border-gray-100 mb-4 pb-2">Create post</h1>
            <div className="flex items-center">
                <Avatar src={user?.photo}/>
                <div className="ml-4">
                    <h3 className="text-lg font-medium">
                        {user?.fullName}
                    </h3>
                    <p className="flex text-gray-600 font-medium gap-1 items-center">
                        <MdPublic fontSize={16}/> Public
                    </p>
                </div>
            </div>
            <form onSubmit={submitForm}>
                <BasicInput
                    textarea
                    labelHide
                    label="What's your mind?"
                    onChange={(e) => setBody(e.target.value)}
                    value={body}
                />
                <input
                    ref={inputImageRef}
                    type="file"
                    hidden name="image"
                    accept="image/*"
                    onChange={fileInputChangeHandle}
                />

                {selectedImage ? (
                    <div
                        className="relative max-w-sm m-auto relative border-3 border-solid border-gray-300 rounded-2xl">
                        <IconButton
                            className="!absolute right-0 top-0 bg-white hover:bg-gray-300"
                            onClick={() => setSelectedImage(null)}>
                            <ImCross fontSize={15} color="#000"/>
                        </IconButton>
                        <img className="rounded-2xl" src={URL.createObjectURL(selectedImage)} alt="post image"/>
                    </div>) : null}

                <div className="flex mt-4 justify-between items-center">
                    <IconButton className="text-theme-blue p-6" onClick={() => inputImageRef.current?.click()}>
                        <HiPhotograph fontSize={30}/>
                    </IconButton>
                    <div>
                        <Button type="submit" isLoading={isLoading}>
                            Publish Post
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreatePostForm