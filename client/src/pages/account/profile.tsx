import React, { useState, FormEvent } from 'react'
import { useSelector } from "react-redux"
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Zoom } from "@mui/material"
import { toast } from 'react-toastify'

import MainLayout from "@components/layouts/MainLayout"
import LeftSidebar from "@components/settings/LeftSidebar"
import ensureServerSideAuth from "@utils/ensureServerSideAuth"
import { selectAuthState } from "@features/authSlice"
import Avatar from "@components/common/Avatar"
import { ProfileErrors } from "@interfaces/account.interfaces"
import AnimatedInput from '@components/common/AnimatedInput'
import PrimaryButton from '@components/common/PrimaryButton'
import { useUpdateProfileMutation } from '@services/accountApi'

function Profile() {
    //hooks
    const { user } = useSelector(selectAuthState)
    const [updateProfile, { isLoading }] = useUpdateProfileMutation()

    //form data
    const [firstName, setFirstName] = useState<string>(user.firstName)
    const [lastName, setLastName] = useState<string>(user.lastName)
    const [username, setUsername] = useState<string>(user.username)
    const [bio, setBio] = useState<string>(user.profile?.bio!)
    const [phone, setPhone] = useState<string>(user.profile?.phone!)
    const [location, setLocation] = useState<string>(user.profile?.location!)
    const [birthdate, setBirthdate] = useState<any>(user.profile?.birthdate!)
    const [gender, setGender] = useState<string>(user.profile?.gender!)

    const [inputErrors, setInputErrors] = useState<ProfileErrors>({})

    async function submitFormHandle(event: FormEvent) {
        event.preventDefault()
        const formatedBirthdate = birthdate ? new Date(birthdate).toISOString() : ''

        try {
            await updateProfile({ firstName, lastName, username, bio, phone, location, gender, birthdate: formatedBirthdate }).unwrap()
            setInputErrors({})
            toast.success('Profile has been updated.')
        } catch (err: any) {
            console.error(err)
            toast.error('Profile has not been updated.')
            if (err?.data?.errors) setInputErrors(err.data.errors)
        }
    }

    return (
        <MainLayout showSidebar={false}>
            <div className="pt-6">
                <div className="flex gap-3">
                    {/*sidebar*/}
                    <LeftSidebar />

                    <div className="box w-full">
                        <div className="flex items-center">
                            <div className="w-3/12 flex justify-end p-4">
                                <Avatar src={user.photo} alt={user.username} />
                            </div>
                            <div className="flex-auto p-4">
                                <h3 className="text-xl">{user.username}</h3>
                            </div>
                        </div>

                        <form className="box flex-auto p-4 w-full" onSubmit={submitFormHandle}>
                            <AnimatedInput
                                size="medium"
                                label="First Name"
                                value={firstName}
                                error={inputErrors?.firstName?.msg}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <AnimatedInput
                                size="medium"
                                label="Last Name"
                                value={lastName}
                                error={inputErrors?.lastName?.msg}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <AnimatedInput
                                multiline
                                size="medium"
                                label="Bio"
                                value={bio}
                                error={inputErrors?.bio?.msg}
                                onChange={(e) => setBio(e.target.value)}
                            />
                            <AnimatedInput
                                size="medium"
                                label="Username"
                                value={username}
                                error={inputErrors?.username?.msg}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <AnimatedInput
                                size="medium"
                                label="Email Address"
                                value={user.email}
                                disabled
                                className="text-gray-500"
                            />
                            <AnimatedInput
                                size="medium"
                                label="Phone Number"
                                type="number"
                                value={phone}
                                error={inputErrors?.phone?.msg}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <AnimatedInput
                                size="medium"
                                label="Location"
                                value={location}
                                error={inputErrors?.location?.msg}
                                onChange={(e) => setLocation(e.target.value)}
                            />


                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MobileDatePicker
                                    label="Date of birth"
                                    inputFormat="DD/MM/YYYY"
                                    value={birthdate}
                                    onChange={(value) => setBirthdate(value)}
                                    renderInput={({ error, size, ...params }) => (
                                        <AnimatedInput size="medium" error={inputErrors?.birthdate?.msg} {...params} />
                                    )}
                                />
                            </LocalizationProvider>

                            <div className="mt-3">
                                <FormControl>
                                    <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    </RadioGroup>
                                </FormControl>
                                {inputErrors?.gender && (
                                    <Zoom in>
                                        <p className="font-medium text-red-600 text-[12px]">
                                            {inputErrors?.gender.msg}
                                        </p>
                                    </Zoom>
                                )}
                            </div>

                            <PrimaryButton type="submit" title="Update" isLoading={isLoading} />

                        </form>
                    </div>

                </div>
            </div>
        </MainLayout>
    )
}

export default Profile

export const getServerSideProps = ensureServerSideAuth