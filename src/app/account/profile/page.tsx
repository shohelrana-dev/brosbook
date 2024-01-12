'use client'
import { LoadingButton } from '@mui/lab'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { useEffect } from 'react'
import 'react-calendar/dist/Calendar.css'
import DatePicker from 'react-date-picker'
import 'react-date-picker/dist/DatePicker.css'
import toast from 'react-hot-toast'
import BasicInput from '~/components/form/BasicInput'
import Loader from '~/components/global/Loader'
import useAuthState from '~/hooks/useAuthState'
import { useForm } from '~/hooks/useForm'
import { ProfilePayload } from '~/interfaces/account.interfaces'
import { useUpdateProfileMutation } from '~/services/accountApi'
import { useGetUserByIdQuery } from '~/services/usersApi'

export default function ProfileSettingsPage() {
	//hooks
	const { user: currentUser } = useAuthState()
	const { data: user, isLoading: isUserLoading } = useGetUserByIdQuery(currentUser?.id!)
	const [updateProfile, { isLoading, isSuccess }] = useUpdateProfileMutation()
	const { formData, onChange, onSubmit, errors, setFormData, clearErrors } =
		useForm<ProfilePayload>(updateProfile)

	useEffect(() => {
		setFormData({
			firstName: user?.firstName || '',
			lastName: user?.lastName || '',
			birthdate: user?.profile?.birthdate ? new Date(user?.profile?.birthdate!) : undefined,
			bio: user?.profile?.bio || '',
			gender: user?.profile?.gender || '',
			phone: user?.profile?.phone || '',
			location: user?.profile?.location! || '',
		})
	}, [user])

	useEffect(() => {
		if (isSuccess) {
			toast.success('Profile updated.')
			clearErrors()
		}
	}, [isLoading, isSuccess])

	if (isUserLoading) {
		return <Loader />
	}

	return (
		<form className='flex-auto p-4 w-full' onSubmit={onSubmit}>
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
				onChange={onChange}
				helpText='Set a display name. This does not change your username.'
			/>
			<BasicInput
				label='Last Name'
				name='lastName'
				value={formData.lastName}
				error={errors?.lastName}
				onChange={onChange}
				helpText='Set a display name. This does not change your username.'
			/>
			<BasicInput
				textarea
				label='Bio'
				name='bio'
				value={formData.bio}
				error={errors?.bio}
				onChange={onChange}
				helpText='A brief description of yourself shown on your profile.'
			/>
			<BasicInput
				label='Phone Number'
				name='phone'
				type='number'
				value={formData.phone}
				error={errors?.phone}
				onChange={onChange}
				helpText='Your current phone number.'
			/>
			<BasicInput
				label='Location'
				name='location'
				value={formData.location}
				error={errors?.location}
				onChange={onChange}
				helpText='Your full address.'
			/>

			<div className='flex flex-col'>
				<label htmlFor='birthdate' className='text-gray-800 mb-2'>
					Date of birth
				</label>
				<DatePicker
					onChange={(value: any) => setFormData({ ...formData, birthdate: value })}
					value={formData.birthdate}
					format={'dd-MM-y'}
					maxDate={new Date()}
					className='!rounded-lg'
				/>
				{errors?.birthdate ? (
					<p className='font-medium text-red-600 text-[12px]'>{errors?.birthdate}</p>
				) : null}
			</div>

			<div className='my-5'>
				<FormControl onChange={(e: any) => setFormData({ ...formData, gender: e.target.value })}>
					<FormLabel id='gender' sx={{ color: '#000' }}>
						Gender
					</FormLabel>
					<RadioGroup aria-labelledby='gender' value={formData?.gender} name='gender'>
						<FormControlLabel value='female' control={<Radio />} label='Female' />
						<FormControlLabel value='male' control={<Radio />} label='Male' />
					</RadioGroup>
				</FormControl>
				{errors?.gender ? (
					<p className='font-medium text-red-600 text-[12px]'>{errors?.gender}</p>
				) : null}
			</div>

			<LoadingButton variant='contained' type='submit' loading={isLoading} className='w-32'>
				Update
			</LoadingButton>
		</form>
	)
}
