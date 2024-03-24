import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { BiLogInCircle as LoginIcon } from 'react-icons/bi'
import Modal, { useToggle } from 'react-minimal-modal'
import Button from '~/components/global/Button'

export interface Options {
    title: string
    message?: string
}

//@ts-ignore
const UnauthorizedPopupContext = createContext<(options: Options) => void | null>(null)

export function UnauthorizedPopupProvider({ children }: PropsWithChildren) {
    const [options, setOptions] = useState<Options>()
    const pathname = usePathname()
    const [isOpen, toggle] = useToggle(false)

    function unauthorizedAlert(options: Options): void {
        setOptions(() => options)
        toggle()
    }

    return (
        <UnauthorizedPopupContext.Provider value={unauthorizedAlert}>
            {children}
            <Modal open={isOpen} toggle={toggle} hideIcon>
                <div className='h-full flex flex-col justify-center items-center text-center'>
                    <div className='mb-4'>
                        <LoginIcon fontSize='50' color='#FF1493' />
                    </div>
                    <div className='mb-4'>
                        <h3 className='text-xl md:text-2xl mb-2'>{options?.title}</h3>
                        <p className='text-gray-700'>{options?.message}</p>
                    </div>
                    <div className='w-full mt-4'>
                        <Button
                            as={Link}
                            href={`/auth/login?redirect_to=${pathname}`}
                            fullWidth
                            className='mb-3'
                            onClick={toggle}
                        >
                            Log in
                        </Button>
                        <Button
                            as={Link}
                            href='/auth/signup'
                            variant='bordered'
                            fullWidth
                            onClick={toggle}
                        >
                            Sign up
                        </Button>
                    </div>
                </div>
            </Modal>
        </UnauthorizedPopupContext.Provider>
    )
}

export default function useUnauthorizedAlert() {
    const context = useContext(UnauthorizedPopupContext)

    if (!context) {
        throw Error('Please Use UnauthorizedPopupProvider in parent component.')
    }

    return context
}
