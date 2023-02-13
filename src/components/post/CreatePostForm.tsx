import React, { FormEvent, useState } from 'react'
import { MdPublic } from "react-icons/md"
import { HiPhotograph } from "react-icons/hi"
import { RxCross2 as CancelIcon } from "react-icons/rx"
import toast from "react-hot-toast"

import Avatar from "@components/global/Avatar"
import { useCreatePostMutation } from "@services/postsApi"
import BasicInput from "@components/global/BasicInput"
import Button from "@components/global/Button"
import useAuthState from "@hooks/useAuthState"
import IconButton from "@components/global/IconButton"
import useSelectFile from "@hooks/useSelectFile"

function CreatePostForm(){
    //hooks
    const { user, isAuthenticated }                                                        = useAuthState()
    const [createPost, { isLoading }]                                                      = useCreatePostMutation()
    const [body, setBody]                                                                  = useState<string>( '' )
    const { inputRef, selectedFile: selectedImage, removeSelectedFile, onChange, onClick } = useSelectFile()

    async function submitForm( event: FormEvent ){
        event.preventDefault()

        if( ! body && ! selectedImage ) return

        const formData = new FormData()
        if( body ){
            formData.append( 'body', body )
        }
        if( selectedImage ){
            formData.append( 'image', selectedImage )
        }

        try {
            await createPost( formData ).unwrap()
            toast.success( 'Post published.' )
            if( body ) setBody( '' )
            if( selectedImage ){
                removeSelectedFile()
            }
        } catch ( err: any ) {
            console.error( err )
            toast.error( 'Post couldn\'t be saved.' )
        }
    }

    if( ! isAuthenticated ) return null

    return (
        <div className="relative box p-6 mb-4">
            <h1 className="text-center text-lg lg:text-xl font-bold border-b border-gray-100 mb-4 pb-2">Create post</h1>
            <div className="flex items-center">
                <Avatar src={ user?.avatar?.url }/>
                <div className="ml-4">
                    <h3 className="text-base lg:text-lg font-medium">
                        { user?.fullName }
                    </h3>
                    <p className="flex text-gray-600 font-medium gap-1 items-center">
                        <MdPublic fontSize={ 16 }/> Public
                    </p>
                </div>
            </div>
            <form onSubmit={ submitForm }>
                <BasicInput
                    textarea
                    labelHide
                    label="What's your mind?"
                    onChange={ ( e ) => setBody( e.target.value ) }
                    value={ body }
                />
                <input
                    ref={ inputRef }
                    type="file"
                    hidden name="image"
                    accept="image/*"
                    onChange={ onChange }
                />

                { selectedImage ? (
                    <div
                        className="relative max-w-sm m-auto relative border-3 border-solid border-gray-300 rounded-2xl">
                        <div onClick={ removeSelectedFile } className="absolute right-1 top-1">
                            <IconButton
                                className="bg-black text-white hover:bg-gray-900 hover:text-white z-50 rounded-full">
                                <CancelIcon size={ 15 }/>
                            </IconButton>
                        </div>
                        <img className="rounded-2xl" src={ URL.createObjectURL( selectedImage ) } alt="post image"/>
                    </div> ) : null }

                <div className="flex mt-4 justify-between items-center">
                    <IconButton className="text-theme-blue p-6" onClick={ onClick }>
                        <HiPhotograph fontSize={ 30 }/>
                    </IconButton>
                    <div>
                        <Button type="submit" isLoading={ isLoading } size="sm"
                                disabled={ isLoading || ( ! body && ! selectedImage ) }>
                            Publish Post
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreatePostForm