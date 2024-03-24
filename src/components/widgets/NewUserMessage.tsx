'use client'
import Link from 'next/link'
import Button from '~/components/global/Button'
import siteMetadata from '~/utils/siteMetadata'

export default function NewUserMessage() {
    return (
        <div className='card p-5'>
            <h2 className='text-xl font-medium mb-2'>New to {siteMetadata.appName}?</h2>
            <p className='text-gray-800'>Sign up now to get your own personalized timeline!</p>

            <Button as={Link} href='/auth/signup' variant='faded' className='mt-3'>
                Goto Signup page
            </Button>
        </div>
    )
}
