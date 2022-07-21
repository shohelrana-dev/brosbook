import React, { FormEvent, useEffect, useState }                  from 'react'
import { useDispatch, useSelector }                               from "react-redux"
import { FormControl, FormControlLabel, Radio, RadioGroup, Zoom } from "@mui/material"

import { RootState } from "@store/store"
import { withAuth }  from "@utils/withAuth"
import Avatar                from "@components/common/Avatar"
import MainLayout            from "@components/layouts/MainLayout"
import BasicInputGroup       from "@components/common/BasicInputGroup"
import LeftSidebar           from "@components/settings/LeftSidebar"
import { updateProfile }     from "@actions/settingsActions"
import DatePicker            from "@components/common/DatePicker"
import ProfileCoverPhotoEdit from "@components/settings/ProfileCoverPhotoEdit"

function EditProfile() {
    //hooks
    const { user }   = useSelector( ( state: RootState ) => state.auth )
    const { errors } = useSelector( ( state: RootState ) => state.settings )
    const dispatch   = useDispatch()

    //form data
    const [ firstName, setFirstName ] = useState<string>( '' )
    const [ lastName, setLastName ]   = useState<string>( '' )
    const [ bio, setBio ]             = useState<string>( '' )
    const [ phone, setPhone ]         = useState<string>( '' )
    const [ location, setLocation ]   = useState<string>( '' )
    const [ birthdate, setBirthdate ] = useState<any>( '' )
    const [ gender, setGender ]       = useState<string>( '' )

    useEffect( setDefaultValues, [ user ] )

    function setDefaultValues() {
        setFirstName( user.firstName )
        setLastName( user.lastName )
        setBio( user.profile?.bio! )
        setPhone( user.profile?.phone! )
        setLocation( user.profile?.location! )
        setBirthdate( user.profile?.birthdate! )
        setGender( user.profile?.gender! )
    }

    function submitFormHandle( event: FormEvent ) {
        event.preventDefault()

        const form = event.target as HTMLFormElement

        const formData = new FormData()
        formData.append( 'profilePhoto', form.profilePhoto.files[0] )
        formData.append( 'coverPhoto', form.coverPhoto.files[0] )
        formData.append( 'firstName', firstName )
        formData.append( 'lastName', lastName )
        formData.append( 'bio', bio )
        formData.append( 'phone', phone )
        formData.append( 'location', location )
        formData.append( 'birthdate', birthdate )
        formData.append( 'gender', gender )

        dispatch( updateProfile( formData ) )
    }

    return (
        <MainLayout>
            <div className="container pt-6">
                <div className="box flex">
                    {/*sidebar*/ }
                    <LeftSidebar/>

                    {/*Form*/ }
                    <form className="flex-auto" onSubmit={ submitFormHandle }>
                        <ProfileCoverPhotoEdit/>

                        <div className="flex items-center">
                            <div className="w-3/12 flex justify-end p-4">
                                <Avatar online={ false } src={ user.photo } alt={ user.username }/>
                            </div>
                            <div className="flex-auto p-4">
                                <h3 className="text-xl">{ user.username }</h3>
                            </div>
                        </div>

                        <BasicInputGroup label="First Name" name="firstName" value={ firstName }
                                         error={ errors.firstName }
                                         onChange={ ( e ) => setFirstName( e.target.value ) }/>
                        <BasicInputGroup label="Last Name" name="lastName" value={ lastName }
                                         error={ errors.lastName }
                                         onChange={ ( e ) => setLastName( e.target.value ) }/>
                        <BasicInputGroup label="Bio" name="bio" textarea value={ bio }
                                         error={ errors.bio }
                                         onChange={ ( e ) => setBio( e.target.value ) }/>
                        <BasicInputGroup label="Email Address" name="email" value={ user.email } disabled
                                         className="text-gray-500"/>
                        <BasicInputGroup label="Phone Number" name="phone" type="number" value={ phone }
                                         error={ errors.phone }
                                         onChange={ ( e ) => setPhone( e.target.value ) }/>
                        <BasicInputGroup label="Location" name="location" value={ location }
                                         error={ errors.location }
                                         onChange={ ( e ) => setLocation( e.target.value ) }/>


                        <DatePicker label="Date of birth" onChange={ setBirthdate } value={ birthdate }
                                    error={ errors?.birthdate?.msg } name="birthdate"/>

                        <div className="flex items-center">
                            <div className="w-3/12 flex justify-end p-4">
                                <label htmlFor="gender" className="font-medium text-gray-800 cursor-pointer">
                                    Gender
                                </label>
                            </div>
                            <div className="flex-auto p-4">
                                <FormControl>
                                    <RadioGroup name="gender" onChange={ e => setGender( e.target.value ) }>
                                        <FormControlLabel value="male"
                                                          control={ <Radio checked={ gender === 'male' }/> }
                                                          label="Male"/>
                                        <FormControlLabel value="female"
                                                          control={ <Radio checked={ gender === 'female' }/> }
                                                          label="Female"/>
                                    </RadioGroup>
                                </FormControl>
                                { errors.gender && (
                                    <Zoom in>
                                        <p className="font-medium text-red-600 text-[12px]">
                                            { errors.gender.msg }
                                        </p>
                                    </Zoom>
                                ) }
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="w-3/12 flex justify-end p-4"/>
                            <div className="p-4">
                                <button type="submit" className="button-blue">
                                    Update
                                </button>
                            </div>
                        </div>

                    </form>

                </div>
            </div>
        </MainLayout>
    )
}

export default withAuth( EditProfile )