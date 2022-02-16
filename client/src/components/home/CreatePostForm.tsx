import React, { ChangeEvent, FormEvent, useRef, useState } from 'react'
import Avatar                                              from "@components/common/Avatar"
import PublicIcon                                          from "@mui/icons-material/Public"
import InsertPhotoIcon                                     from "@mui/icons-material/InsertPhotoOutlined"
import { useDispatch, useSelector }                        from "react-redux"
import { RootState }                                       from "@store/index"
import { createPost }                                      from "@actions/postsActions"
import CancelIcon                                          from '@mui/icons-material/Cancel';

function CreatePostForm() {

    //hooks
    const user                                = useSelector( ( state: RootState ) => state.auth.user )
    const inputImageRef                       = useRef<HTMLInputElement | null>( null )
    const [ selectedImage, setSelectedImage ] = useState<any>( null )
    const dispatch                            = useDispatch()


    async function submitFormHandle( event: FormEvent<HTMLFormElement> ) {
        event.preventDefault()
        const form    = event.target as HTMLFormElement
        const content = form.content.value

        if ( !content && !selectedImage ) return

        await createPost( content, selectedImage )

        form.reset()
        setSelectedImage( null )
    }

    function fileInputChangeHandle( event: ChangeEvent<HTMLInputElement> ) {
        if ( event.target.files && event.target.files.length > 0 ) {
            setSelectedImage( event.target.files[0] )
        }
    }

    return (
        <>
            <h1 className="text-center text-xl font-bold">Create post</h1>
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
            <form onSubmit={ submitFormHandle }>
                        <textarea name="content" className="input-basic text-gray-600 text-lg font-medium p-4 my-2"
                                  placeholder="What's your mind?"/>
                <input ref={ inputImageRef } type="file" hidden name="image" accept="image/*"
                       onChange={ fileInputChangeHandle }/>

                { selectedImage && (
                    <div className="max-w-sm m-auto relative border-4 border-solid border-gray-300 rounded-2xl">
                        <button
                            className="absolute right-0 top-0 transition-all duration-300 text-gray-600 p-1 hover:bg-gray-400 rounded-full"
                            onClick={ () => setSelectedImage( null ) }>
                            <CancelIcon className="bg-white rounded-full"/>
                        </button>
                        <img className="rounded-2xl" src={ URL.createObjectURL( selectedImage ) } alt="post image"/>
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
        </>
    )
}

export default CreatePostForm