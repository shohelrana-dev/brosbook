'use client'
import Link from 'next/link'
import { FormEvent } from 'react'
import { FiLock } from 'react-icons/fi'
import AnimatedInput from '~/components/form/AnimatedInput'
import Button from '~/components/global/Button'
import { useForm } from '~/hooks/useForm'
import { extractErrors } from '~/lib/error'
import { useForgotPasswordMutation } from '~/services/authApi'

export default function ForgotPassword() {
    //hooks
    const [forgotPasswordMutation, { isLoading, isSuccess, error }] = useForgotPasswordMutation()
    const { formData, handleChange } = useForm<{ email: string }>()

    const errors = extractErrors<{ email: string }>(error)

    function handleSubmittedForm(e: FormEvent) {
        e.preventDefault()

        forgotPasswordMutation(formData)
    }

    let content = null
    if (isSuccess) {
        content = (
            <div className='text-center'>
                <h1 className='heading-auth'>Reset Password</h1>
                <p>
                    Check your email for a link to reset your password. If it doesn&apos;t appear within
                    a few minutes, check your spam folder.
                </p>
                <Link href='/auth/login' className='inline-block mt-5'>
                    <Button variant='bordered'>Return to login</Button>
                </Link>
            </div>
        )
    } else {
        content = (
            <>
                <h1 className='heading-auth'>Trouble with logging in?</h1>
                <small className='block text-gray-500 text-center mb-2'>
                    Enter your email address and we will send you a link to get back into your account.
                </small>

                <form className='form' onSubmit={handleSubmittedForm}>
                    <AnimatedInput
                        label='Email'
                        name='email'
                        value={formData.email}
                        error={errors?.email}
                        onChange={handleChange}
                    />
                    <Button type='submit' radius='md' isLoading={isLoading}>
                        Send Reset Link
                    </Button>
                </form>
            </>
        )
    }

    return (
        <>
            <div className='card-auth'>
                <div className='flex flex-wrap justify-center mb-2'>
                    <FiLock size='30' />
                </div>

                {content}
            </div>

            <div className='card-auth text-center mt-2 text-gray-800'>
                Go back?&nbsp;
                <Link href='/auth/login' className='text-blue-500 font-medium'>
                    Log In
                </Link>
            </div>
        </>
    )
}
