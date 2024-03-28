'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent } from 'react'
import Modal, { useToggle } from 'react-minimal-modal'
import AnimatedInput from '~/components/form/AnimatedInput'
import PasswordInput from '~/components/form/PasswordInput'
import Button from '~/components/global/Button'
import { useForm } from '~/hooks/useForm'
import useSession from '~/hooks/useSession'
import { ChangeUsernamePayload } from '~/interfaces/account.interfaces'
import { useChangeUsernameMutation } from '~/services/accountApi'
import { extractErrors } from '~/utils/error'

export default function ChangeUsernameModal() {
    const { user } = useSession()
    const [changeUsername, { isLoading, error }] = useChangeUsernameMutation()
    const { formData, handleChange } = useForm<ChangeUsernamePayload>({
        username: user?.username!,
        password: '',
    })
    const [isOpen, toggle] = useToggle(true)
    const router = useRouter()
    useSession({ require: true })

    const errors = extractErrors<ChangeUsernamePayload>(error)

    async function handleFormSubmit(e: FormEvent) {
        e.preventDefault()

        await changeUsername(formData).unwrap()
        handleClose()
    }

    function handleClose() {
        toggle()
        //delay for show modal animation
        setTimeout(() => router.back(), 400)
    }

    return (
        <Modal open={isOpen} title='Update username' className='max-w-screen-sm' onClose={handleClose}>
            <p className='mb-6 text-gray-700 -mt-1'>Set your new username using password.</p>
            <form className='form' onSubmit={handleFormSubmit} autoComplete='off'>
                <AnimatedInput
                    label='Username'
                    name='username'
                    value={formData.username}
                    error={errors?.username}
                    onChange={handleChange}
                />
                <div>
                    <PasswordInput
                        label='Password'
                        name='password'
                        value={formData.password}
                        error={errors?.password}
                        onChange={handleChange}
                    />
                    <Link href='/auth/forgot_password' className='text-blue-600 text-sm block'>
                        Forgot password?
                    </Link>
                </div>

                <div className='text-right'>
                    <Button type='submit' isLoading={isLoading} className='min-w-32'>
                        Update
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
