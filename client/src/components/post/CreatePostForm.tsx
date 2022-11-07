import React, { ChangeEvent, FormEvent, useRef, useState } from 'react'
import PublicIcon                                          from "@mui/icons-material/Public"
import InsertPhotoIcon                                     from "@mui/icons-material/InsertPhotoOutlined"
import CancelIcon                                          from '@mui/icons-material/Cancel'
import { toast }                                           from "react-toastify"
import { CircularProgress }                                from "@mui/material"
import { useSelector }                                     from "react-redux"

import Avatar                    from "@components/common/Avatar"
import { selectAuthState }       from "@slices/authSlice"
import { useCreatePostMutation } from "@services/postsApi"
import Image from "next/image";

function CreatePostForm(){

    //hooks
    const { user }                          = useSelector( selectAuthState )
    const [createPost, { isLoading }]       = useCreatePostMutation()
    const inputImageRef                     = useRef<HTMLInputElement | null>( null )
    const [selectedImage, setSelectedImage] = useState<any>( null )
    const [body, setBody]           = useState<string>( '' )

    async function submitForm( event: FormEvent ){
        event.preventDefault()

        if( ! body && ! selectedImage ) return

        const formData = new FormData()
        formData.append( 'body', body )
        formData.append( 'image', selectedImage )

        try {
            await createPost( formData ).unwrap()
            toast.success( 'Post has been published.' )
            if( body ) setBody( '' )
            if( selectedImage ) setSelectedImage( null )
        } catch ( err: any ) {
            console.error( err )
            toast.error( 'Post couldn\'t be saved.' )
        }
    }

    function fileInputChangeHandle( event: ChangeEvent<HTMLInputElement> ){
        if( event.target.files && event.target.files.length > 0 ){
            setSelectedImage( event.target.files[0] )
        }
    }

    return (
        <div className="relative box p-6">
            { isLoading && <div
                className="absolute left-0 top-0 w-full h-full bg-gray-100 opacity-50 flex justify-center items-center">
                <CircularProgress/>
            </div> }
            <h1 className="text-center text-xl font-bold border-b border-gray-100 mb-4 pb-2">Create post</h1>
            <div className="flex items-center">
                <Avatar src={ user.photo }/>
                <div className="ml-4">
                    <h3 className="text-lg font-medium">
                        { user.fullName }
                    </h3>
                    <p className="text-gray-600 font-medium">
                        <PublicIcon/> Public
                    </p>
                </div>
            </div>
            <form onSubmit={ submitForm }>
                <textarea
                    className="input-basic text-gray-600 text-lg font-medium p-4 my-2"
                    placeholder="What's your mind?"
                    onChange={ ( e ) => setBody( e.target.value ) }
                    value={ body }
                />
                <input
                    ref={ inputImageRef }
                    type="file"
                    hidden name="image"
                    accept="image/*"
                    onChange={ fileInputChangeHandle }
                />

                { selectedImage && (
                    <div className="max-w-sm m-auto relative border-4 border-solid border-gray-300 rounded-2xl">
                        <button
                            className="absolute right-0 top-0 transition-all duration-300 text-gray-600 p-1 hover:bg-gray-400 rounded-full"
                            onClick={ () => setSelectedImage( null ) }>
                            <CancelIcon className="bg-white rounded-full"/>
                        </button>
                        <Image className="rounded-2xl" src={ URL.createObjectURL( selectedImage ) } alt="post image"/>
                    </div>
                ) }

                <div className="flex mt-4 justify-between items-center">
                    <button type="button"
                            className="text-theme-blue hover:bg-theme-gray transition-all duration-300 p-3 rounded-full"
                            onClick={ () => inputImageRef.current?.click() }
                    >
                        <InsertPhotoIcon fontSize="large"/>
                    </button>
                    <div>
                        <button type="submit" className="button-blue">
                            Publish Post
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreatePostForm