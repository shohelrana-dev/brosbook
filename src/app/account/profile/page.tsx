"use client"
import { useEffect } from "react"
import DatePicker from 'react-date-picker'
import { ProfilePayload } from "@interfaces/account.interfaces"
import Button from '@components/common/Button'
import { useUpdateProfileMutation } from '@services/accountApi'
import BasicInput from "@components/common/BasicInput"
import { Radio } from "@material-tailwind/react"
import useCurrentUser from "@hooks/useCurrentUser"
import Loading from "@components/common/Loading"
import { useForm } from "@hooks/useForm"
import toast from "react-hot-toast"

export default function ProfileSettingsPage(){
    //hooks
    const { user, isAuthenticated }                                          = useCurrentUser()
    const [updateProfile, { isLoading, isSuccess }]                          = useUpdateProfileMutation()
    const { formData, onChange, onSubmit, errors, setFormData, clearErrors } = useForm<ProfilePayload>( updateProfile )

    useEffect( () => {
        setFormData( {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            birthdate: user?.profile?.birthdate ? new Date( user?.profile?.birthdate! ) : undefined,
            bio: user?.profile?.bio || '',
            gender: user?.profile?.gender || '',
            phone: user?.profile?.phone || '',
            location: user?.profile?.location! || ''
        } )
    }, [user] )

    useEffect( () => {
        if( isSuccess ){
            toast.success( 'Profile updated.' )
            clearErrors()
        }
    }, [isLoading, isSuccess] )

    if( ! isAuthenticated ) return <Loading/>

    return (
        <form className="flex-auto p-4 w-full" onSubmit={ onSubmit }>
            <div className="mb-7">
                <h3 className="text-base sm:text-lg mb-3">Customize profile</h3>
                <small className="text-gray-500">PROFILE INFORMATION</small>
                <hr/>
            </div>

            <BasicInput
                label="First Name"
                name="firstName"
                value={ formData.firstName }
                error={ errors?.firstName }
                onChange={ onChange }
                helpText="Set a display name. This does not change your username."
            />
            <BasicInput
                label="Last Name"
                name="lastName"
                value={ formData.lastName }
                error={ errors?.lastName }
                onChange={ onChange }
                helpText="Set a display name. This does not change your username."
            />
            <BasicInput
                textarea
                label="Bio"
                name="bio"
                value={ formData.bio }
                error={ errors?.bio }
                onChange={ onChange }
                helpText="A brief description of yourself shown on your profile."
            />
            <BasicInput
                label="Phone Number"
                name="phone"
                type="number"
                value={ formData.phone }
                error={ errors?.phone }
                onChange={ onChange }
                helpText="Your current phone number."
            />
            <BasicInput
                label="Location"
                name="location"
                value={ formData.location }
                error={ errors?.location }
                onChange={ onChange }
                helpText="Your address."
            />

            <div className="flex flex-col">
                <label htmlFor="birthdate" className="text-gray-800">Date of birth</label>
                <DatePicker onChange={ ( value: Date ) => setFormData( { ...formData, birthdate: value } ) }
                            value={ formData.birthdate } className="rounded-lg"/>
                { errors?.birthdate ? (
                    <p className="font-medium text-red-600 text-[12px]">
                        { errors?.birthdate }
                    </p>
                ) : null }
            </div>

            <div className="my-5">
                <h4 className="mb-2 text-lg">Gender</h4>
                <div className="flex justify-between max-w-[100px]">
                    <Radio
                        id="male"
                        name="male"
                        label="Male"
                        onChange={ ( e ) => setFormData( { ...formData, gender: 'male' } ) }
                        checked={ formData.gender === 'male' }
                    />
                </div>
                <div className="flex mt-3 justify-between max-w-[100px]">
                    <Radio
                        id="female"
                        label="female"
                        name="male"
                        onChange={ ( e ) => setFormData( { ...formData, gender: 'female' } ) }
                        checked={ formData.gender === 'female' }
                    />
                </div>
                { errors?.gender ? (
                    <p className="font-medium text-red-600 text-[12px]">
                        { errors?.gender }
                    </p>
                ) : null }
            </div>

            <Button type="submit" isLoading={ isLoading } className="w-32">
                Update
            </Button>

        </form>
    )
}