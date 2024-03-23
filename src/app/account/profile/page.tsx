'use client'
import { FormEvent, useEffect } from 'react'
import 'react-calendar/dist/Calendar.css'
import DatePicker from 'react-date-picker'
import 'react-date-picker/dist/DatePicker.css'
import BasicInput from '~/components/form/BasicInput'
import Button from '~/components/ui/Button'
import Loader from '~/components/ui/Loader'
import Transition from '~/components/ui/Transition'
import useAuth from '~/hooks/useAuth'
import { useForm } from '~/hooks/useForm'
import { ProfilePayload } from '~/interfaces/account.interfaces'
import { Radio, RadioGroup } from '~/lib/nextui'
import { useUpdateProfileMutation } from '~/services/accountApi'
import { useGetUserByIdQuery } from '~/services/usersApi'
import { extractErrors } from '~/utils/error'

export default function ProfileSettingsPage() {
    //hooks
    const { user: currentUser } = useAuth()
    const { data: user, isLoading: isUserLoading } = useGetUserByIdQuery(currentUser?.id!)
    const [updateProfile, { isLoading, error }] = useUpdateProfileMutation()
    const { formData, handleChange, setFormData } = useForm<ProfilePayload>()

    const errors = extractErrors<ProfilePayload>(error)

    useEffect(() => {
        if (user && 'id' in user) {
            setFormData({
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                birthdate: user?.profile?.birthdate ? new Date(user?.profile?.birthdate!) : undefined,
                bio: user?.profile?.bio || '',
                gender: user?.profile?.gender || '',
                phone: user?.profile?.phone || '',
                location: user?.profile?.location! || '',
            })
        }
    }, [user, setFormData])

    async function handleFormSubmit(e: FormEvent) {
        e.preventDefault()

        updateProfile(formData)
    }

    if (isUserLoading) {
        return <Loader />
    }

    return (
        <Transition>
            <form className='flex-auto p-4 w-full' onSubmit={handleFormSubmit}>
                <div className='mb-7'>
                    <h3 className='text-base sm:text-lg mb-3'>Customize profile</h3>
                    <small className='text-gray-500'>PROFILE INFORMATION</small>
                    <hr />
                </div>

                <BasicInput
                    label='First Name'
                    name='firstName'
                    value={formData.firstName}
                    error={errors?.firstName}
                    onChange={handleChange}
                    description='Set a display name. This does not change your username.'
                />
                <BasicInput
                    label='Last Name'
                    name='lastName'
                    value={formData.lastName}
                    error={errors?.lastName}
                    onChange={handleChange}
                    description='Set a display name. This does not change your username.'
                />
                <BasicInput
                    textarea
                    label='Bio'
                    name='bio'
                    value={formData.bio}
                    error={errors?.bio}
                    onChange={handleChange}
                    description='A brief description of yourself shown on your profile.'
                />
                <BasicInput
                    label='Phone Number'
                    name='phone'
                    type='number'
                    value={formData.phone}
                    error={errors?.phone}
                    onChange={handleChange}
                    description='Your current phone number.'
                />
                <BasicInput
                    label='Location'
                    name='location'
                    value={formData.location}
                    error={errors?.location}
                    onChange={handleChange}
                    description='Your full address.'
                />

                <div className='flex flex-col'>
                    <label htmlFor='birthdate' className='text-gray-900 font-medium mb-2'>
                        Date of birth
                    </label>
                    <DatePicker
                        onChange={(value: any) => setFormData({ ...formData, birthdate: value })}
                        value={formData.birthdate}
                        format={'dd-MM-y'}
                        maxDate={new Date()}
                        className='!rounded-lg'
                    />
                    {!!errors?.birthdate && (
                        <p className='font-medium text-red-600 text-[12px]'>
                            {errors?.birthdate as any}
                        </p>
                    )}
                </div>

                <div className='my-5'>
                    <RadioGroup
                        label='Gender'
                        value={formData.gender}
                        name='gender'
                        onChange={handleChange}
                        classNames={{ label: 'text-gray-900 font-medium' }}
                    >
                        <Radio value='female'>Female</Radio>
                        <Radio value='male'>Male</Radio>
                    </RadioGroup>
                </div>

                <Button type='submit' isLoading={isLoading} className='min-w-32'>
                    Update
                </Button>
            </form>
        </Transition>
    )
}
