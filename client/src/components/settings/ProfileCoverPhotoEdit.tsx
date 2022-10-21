import React, { createRef, useState } from 'react'
import { SRLWrapper }                 from "simple-react-lightbox";
import Image                          from "next/image";
import { useSelector }           from "react-redux";
import { RootState }             from "@store/store";
import CameraEnhanceOutlinedIcon from '@mui/icons-material/CameraEnhanceOutlined';

function ProfileCoverPhotoEdit() {
    const { user }             = useSelector( ( state: RootState ) => state.auth )
    const inputProfilePhotoRef = createRef<HTMLInputElement>()
    const inputCoverPhotoRef   = createRef<HTMLInputElement>()

    const [ profilePhoto, setProfilePhoto ] = useState<any>( null )
    const [ coverPhoto, setCoverPhoto ]     = useState<any>( null )

    return (
        <div>
            <input
                onChange={ ( e ) => setProfilePhoto( e.target.files && e.target.files[0] ) }
                ref={ inputProfilePhotoRef } type="file"
                name="profilePhoto" accept="image/*" hidden/>
            <input onChange={ ( e ) => setCoverPhoto( e.target.files && e.target.files[0] ) }
                   ref={ inputCoverPhotoRef } type="file"
                   name="coverPhoto" accept="image/*" hidden/>
            <div className="relative">
                { user.profile?.coverPhoto ? (
                    <Image
                        src={ coverPhoto ? URL.createObjectURL( coverPhoto ) : user.profile?.coverPhoto }
                        width={ 800 }
                        height={ 400 }
                        objectFit="cover"
                    /> ) : (
                    <Image
                        src={ coverPhoto ? URL.createObjectURL( coverPhoto ) : '/images/placeholder-cover-photo.png' }
                        width={ 800 } height={ 400 }
                        objectFit="cover"/>
                ) }
                <button
                    onClick={ () => inputCoverPhotoRef.current?.click() }
                    type="button"
                    className="absolute left-1/2 top-1/2 translate-y-[-50%] translate-x-[-50%] bg-gray-600 text-white p-1 rounded">
                    <CameraEnhanceOutlinedIcon/>
                </button>
            </div>
            <div className="relative inline-block ml-6 mt-[-60px] rounded-full">
                { user.photo && <Image
                    src={ profilePhoto ? URL.createObjectURL( profilePhoto ) : user.photo } width={ 120 }
                    height={ 120 }
                    objectFit="cover"
                    className="rounded-full !border-white !border-6 !border-solid"
                /> }
                <button
                    onClick={ () => inputProfilePhotoRef.current?.click() }
                    type="button"
                    className="absolute left-1/2 top-1/2 translate-y-[-50%] translate-x-[-50%] bg-gray-600 text-white p-1 rounded">
                    <CameraEnhanceOutlinedIcon/>
                </button>
            </div>
        </div>
    )
}

export default ProfileCoverPhotoEdit