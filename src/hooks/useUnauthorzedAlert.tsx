import ButtonOutline from "@components/common/ButtonOutline"
import Button from "@components/common/Button"
import React, { createContext, PropsWithChildren, useContext, useState } from "react"
import { BiLogInCircle as LoginIcon } from "react-icons/bi"
import Link from "next/link"
import Modal from "@components/common/Modal"
import { usePathname } from "next/navigation"

export interface Options {
    title: string
    message?: string
}

//@ts-ignore
const UnauthorizedPopupContext = createContext<( options: Options ) => void>( null )

export function UnauthorizedPopupProvider( { children }: PropsWithChildren ){
    const [options, setOptions] = useState<Options>()
    const [isOpen, setIsOpen]   = useState<boolean>( false )
    const pathname              = usePathname()

    function unauthorizedAlert( options: Options ): void{
        setOptions( ( prevState ) => options )
        setIsOpen( true )
    }

    function toggleOpen(){
        setIsOpen( ! isOpen )
    }

    return (
        <UnauthorizedPopupContext.Provider value={ unauthorizedAlert }>
            { children }
            <Modal isOpen={ isOpen } onClose={ toggleOpen }>
                <div className="h-full flex flex-col justify-center items-center text-center">
                    <div className="mb-4">
                        <LoginIcon fontSize="50" color="#FF1493"/>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-xl md:text-2xl mb-2">
                            {options?.title}
                        </h3>
                        <p className="text-gray-700">
                            { options?.message }
                        </p>
                    </div>
                    <Link onClick={toggleOpen} href={ `/auth/login?redirect=${ pathname }` } className="mb-3 w-full">
                        <Button size="lg" className="w-full">Log in</Button>
                    </Link>
                    <Link onClick={toggleOpen} href="/auth/signup" className="w-full">
                        <ButtonOutline size="lg" className="w-full">Sign up</ButtonOutline>
                    </Link>
                </div>
            </Modal>
        </UnauthorizedPopupContext.Provider>
    )
}

export default function useUnauthorizedAlert(){
    return useContext( UnauthorizedPopupContext )
}
