"use client"
import React, { useState, FormEvent } from 'react'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Zoom } from "@mui/material"
import { toast } from 'react-toastify'

import Avatar from "@components/common/Avatar"
import { ProfileErrors } from "@interfaces/account.interfaces"
import AnimatedInput from '@components/common/AnimatedInput'
import Button from '@components/common/Button'
import { useUpdateProfileMutation } from '@services/accountApi'
import useAuth from "@hooks/useAuth"

export default function ProfileSettingsPage() {
    //hooks
    const { user, isAuthenticated } = useAuth()
    const [updateProfile, { isLoading }] = useUpdateProfileMutation()

    //form data
    const [firstName, setFirstName] = useState<string>(user?.firstName!)
    const [lastName, setLastName] = useState<string>(user?.lastName!)
    const [username, setUsername] = useState<string>(user?.username!)
    const [bio, setBio] = useState<string>(user?.profile?.bio!)
    const [phone, setPhone] = useState<string>(user?.profile?.phone!)
    const [location, setLocation] = useState<string>(user?.profile?.location!)
    const [birthdate, setBirthdate] = useState<any>(user?.profile?.birthdate!)
    const [gender, setGender] = useState<string>(user?.profile?.gender!)

    const [inputErrors, setInputErrors] = useState<ProfileErrors>({})

    if(!isAuthenticated) return  null

    async function submitFormHandle(event: FormEvent) {
        event.preventDefault()
        const formattedBirthdate = birthdate ? new Date(birthdate).toISOString() : ''

        try {
            await updateProfile({ firstName, lastName, username, bio, phone, location, gender, birthdate: formattedBirthdate }).unwrap()
            setInputErrors({})
            toast.success('Profile has been updated.')
        } catch (err: any) {
            console.error(err)
            toast.error('Profile has not been updated.')
            if (err?.data?.errors) setInputErrors(err.data.errors)
        }
    }

    return (
        <form className="flex-auto p-4 w-full" onSubmit={submitFormHandle}>
            <h3 className="text-lg mb-6">Customize profile</h3>
            <AnimatedInput
                size="medium"
                label="First Name"
                value={firstName}
                error={inputErrors?.firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <AnimatedInput
                size="medium"
                label="Last Name"
                value={lastName}
                error={inputErrors?.lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <AnimatedInput
                multiline
                size="medium"
                label="Bio"
                value={bio}
                error={inputErrors?.bio}
                onChange={(e) => setBio(e.target.value)}
            />
            <AnimatedInput
                size="medium"
                label="Username"
                value={username}
                error={inputErrors?.username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <AnimatedInput
                size="medium"
                label="Email Address"
                value={user?.email}
                disabled
                className="text-gray-500"
            />
            <AnimatedInput
                size="medium"
                label="Phone Number"
                type="number"
                value={phone}
                error={inputErrors?.phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <AnimatedInput
                size="medium"
                label="Location"
                value={location}
                error={inputErrors?.location}
                onChange={(e) => setLocation(e.target.value)}
            />


            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                    label="Date of birth"
                    inputFormat="DD/MM/YYYY"
                    value={birthdate}
                    onChange={(value) => setBirthdate(value)}
                    renderInput={({ error, size, ...params }) => (
                        <AnimatedInput size="medium" error={inputErrors?.birthdate} {...params} />
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
                            {inputErrors?.gender}
                        </p>
                    </Zoom>
                )}
            </div>

            <Button type="submit" title="Update" isLoading={isLoading} />

        </form>
    )
}