'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent } from 'react'
import { FiLock } from 'react-icons/fi'
import AnimatedInput from '~/components/form/AnimatedInput'
import PasswordInput from '~/components/form/PasswordInput'
import Button from '~/components/ui/Button'
import LoadingOverlay from '~/components/ui/LoadingOverlay'
import TextDivider from '~/components/ui/TextDivider'
import { useForm } from '~/hooks/useForm'
import { CredentialsPayload } from '~/interfaces/auth.interfaces'
import { useLoginMutation, useLoginWithGoogleMutation } from '~/services/authApi'
import { extractErrors } from '~/utils/error'
import siteMetadata from '~/utils/siteMetadata'
import GoogleLoginButton from '../ui/GoogleLoginButton'

export default function Login() {
    //hooks
    const router = useRouter()
    const params = useSearchParams()
    const [loginMutation, { isLoading, isSuccess, error }] = useLoginMutation()
    const [loginWithGoogle, { isLoading: isLWGLoading, isSuccess: isLWGSuccess }] =
        useLoginWithGoogleMutation()
    const { formData, handleChange } = useForm<CredentialsPayload>()

    const errors = extractErrors<CredentialsPayload>(error)

    async function handleSubmittedLoginForm(e: FormEvent) {
        e.preventDefault()

        await loginMutation(formData).unwrap()
        router.replace(params.get('redirect_to') || '/')
    }

    return (
        <>
            <LoadingOverlay isLoading={isLoading || isSuccess || isLWGLoading || isLWGSuccess} />

            <div className='card-auth'>
                <div className='flex flex-wrap justify-center mb-2'>
                    <FiLock size='30' />
                </div>
                <h1 className='heading-auth'>Log In to {siteMetadata.appName}</h1>

                <form className='form' onSubmit={handleSubmittedLoginForm}>
                    <AnimatedInput
                        label='Username or email'
                        name='username'
                        onChange={handleChange}
                        error={errors?.username}
                    />
                    <PasswordInput
                        label='Password'
                        name='password'
                        onChange={handleChange}
                        error={errors?.password}
                    />
                    <Button type='submit' radius='md'>
                        Log In
                    </Button>
                </form>

                <TextDivider className='my-5'>OR</TextDivider>

                <GoogleLoginButton loginMutationFn={loginWithGoogle} />

                <small className='block text-center mt-2'>
                    <Link href='/auth/forgot_password' className='text-blue-500'>
                        Forgotten your password?
                    </Link>
                </small>
            </div>

            <div className='card-auth text-center mt-2 text-gray-800'>
                Don&apos;t have an account? &nbsp;
                <Link href='/auth/signup' className='text-blue-500 font-medium'>
                    Sign Up
                </Link>
            </div>
        </>
    )
}
