'use client'
import Link from 'next/link'
import TextOverflow from 'react-text-overflow'
import Transition from '~/components/global/Transition'
import useAuth from '~/hooks/useAuth'
import { Button, Chip } from '~/lib/nextui'

export default function GeneralSettingsPage() {
    const { user } = useAuth()

    return (
        <Transition style={{ padding: 16 }}>
            <div className='mb-7'>
                <h3 className='text-base sm:text-lg mb-3'>Account settings</h3>
                <small className='text-gray-500'>ACCOUNT PREFERENCES</small>
                <hr />
            </div>
            <div className='mt-3'>
                <div className='flex flex-wrap justify-between'>
                    <div className='mr-1'>
                        <h4 className='text-base'>Email address</h4>
                        <div className='text-xs text-gray-500 flex gap-2 items-center'>
                            <TextOverflow text={user?.email!} />
                            <Chip size='sm'>
                                {user?.hasEmailVerified ? 'verified' : 'Not verified!'}
                            </Chip>
                        </div>
                    </div>
                    <div>
                        <Button color='primary' variant='bordered' radius='full' isDisabled>
                            Change
                        </Button>
                    </div>
                </div>
                <div className='flex flex-wrap justify-between mt-5'>
                    <div className='mr-1'>
                        <h4 className='text-base'>Username</h4>
                        <p className='text-xs text-gray-500'>
                            <TextOverflow text={user?.username!} />
                        </p>
                    </div>

                    <Button
                        as={Link}
                        href='/account/username'
                        color='primary'
                        variant='bordered'
                        radius='full'
                    >
                        Change
                    </Button>
                </div>
                <div className='flex justify-between mt-5'>
                    <div className='mr-1'>
                        <h4 className='text-base'>Change password</h4>
                        <p className='text-xs text-gray-500'>
                            <TextOverflow text='Password must be at least 8 characters long' />
                        </p>
                    </div>

                    <Button
                        as={Link}
                        href='/account/password'
                        color='primary'
                        variant='bordered'
                        radius='full'
                    >
                        Change
                    </Button>
                </div>
            </div>
        </Transition>
    )
}
