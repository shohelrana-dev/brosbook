'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent } from 'react'
import { FiLock } from 'react-icons/fi'
import PasswordInput from '~/components/form/PasswordInput'
import { useForm } from '~/hooks/useForm'
import { ResetPassPayload } from '~/interfaces/auth.interfaces'
import { Button } from '~/lib/nextui'
import { useResetPasswordMutation } from '~/services/authApi'
import { extractErrors } from '~/utils/error'

type Props = { token: string }

export default function ResetPassword({ token }: Props) {
    //hooks
    const router = useRouter()
    const [resetPassword, { isLoading, isSuccess, error }] = useResetPasswordMutation()
    const { formData, handleChange } = useForm<ResetPassPayload>({
        password: '',
        confirmPassword: '',
    })

    const errors = extractErrors<ResetPassPayload>(error)

    async function handleSubmittedForm(e: FormEvent) {
        e.preventDefault()

        await resetPassword({ ...formData, token }).unwrap()
        router.push('/auth/login')
    }

    return (
        <>
            <div className='card-auth'>
                <div className='flex flex-wrap justify-center mb-2'>
                    <FiLock size='30' />
                </div>

                <h1 className='heading-auth'>Create a strong password</h1>
                <small className='block text-gray-500 text-center mb-2'>
                    Enter your new password to reset account password. Your password must be at least six
                    characters.
                </small>

                <form className='form' method='post' onSubmit={handleSubmittedForm}>
                    <PasswordInput
                        label='Password'
                        name='password'
                        value={formData.password}
                        error={errors?.password}
                        onChange={handleChange}
                    />
                    <PasswordInput
                        label='Confirm Password'
                        name='confirmPassword'
                        value={formData.confirmPassword}
                        error={errors?.confirmPassword}
                        onChange={handleChange}
                    />
                    <Button type='submit' color='primary' isLoading={isLoading || isSuccess}>
                        Reset
                    </Button>
                </form>
            </div>

            <div className='card-auth text-center mt-2 text-gray-800'>
                Go back? &nbsp;
                <Link href='/auth/login' className='text-blue-500 font-medium'>
                    Log In
                </Link>
            </div>
        </>
    )
}
