import React, {FormEvent, useState} from 'react'
import {MdPublic} from "react-icons/md"
import {HiPhotograph} from "react-icons/hi"
import {ImCross} from 'react-icons/im'
import {toast} from "react-toastify"

import Avatar from "@components/common/Avatar"
import {useCreatePostMutation} from "@services/postsApi"
import BasicInput from "@components/common/BasicInput"
import Button from "@components/common/Button"
import useCurrentUser from "@hooks/useCurrentUser"
import IconButton from "@components/common/IconButton"
import useSelectFile from "@hooks/useSelectFile"

function CreatePostForm() {
    //hooks
    const {user} = useCurrentUser()
    const [createPost, {isLoading}] = useCreatePostMutation()
    const [body, setBody] = useState<string>('')
    const {inputRef, selectedFile: selectedImage, removeSelectedFile, onChange, onClick} = useSelectFile()

    async function submitForm(event: FormEvent) {
        event.preventDefault()

        if (!body && !selectedImage) return

        const formData = new FormData()
        if (body) {
            formData.append('body', body)
        }
        if (selectedImage) {
            formData.append('image', selectedImage)
        }

        try {
            await createPost(formData).unwrap()
            toast.success('Post published.')
            if (body) setBody('')
            if (selectedImage) {
                removeSelectedFile()
            }
        } catch (err: any) {
            console.error(err)
            toast.error('Post couldn\'t be saved.')
        }
    }

    return (
        <div className="relative box p-6">
            <h1 className="text-center text-lg lg:text-xl font-bold border-b border-gray-100 mb-4 pb-2">Create post</h1>
            <div className="flex items-center">
                <Avatar src={user?.avatar?.url}/>
                <div className="ml-4">
                    <h3 className="text-base lg:text-lg font-medium">
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
                    ref={inputRef}
                    type="file"
                    hidden name="image"
                    accept="image/*"
                    onChange={onChange}
                />

                {selectedImage ? (
                    <div
                        className="relative max-w-sm m-auto relative border-3 border-solid border-gray-300 rounded-2xl">
                        <IconButton className="!absolute right-0 top-0 bg-white hover:bg-gray-300"
                                    onClick={removeSelectedFile}>
                            <ImCross fontSize={15} color="#000"/>
                        </IconButton>
                        <img className="rounded-2xl" src={URL.createObjectURL(selectedImage)} alt="post image"/>
                    </div>) : null}

                <div className="flex mt-4 justify-between items-center">
                    <IconButton className="text-theme-blue p-6" onClick={onClick}>
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