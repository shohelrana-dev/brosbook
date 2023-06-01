import React, { createContext, PropsWithChildren, useContext, useState } from "react"
import { BiLogInCircle as LoginIcon } from "react-icons/bi"
import Link from "next/link"
import Modal, { useModal } from "react-minimal-modal"
import { usePathname } from "next/navigation"
import { Button } from "@mui/material"

export interface Options {
    title: string
    message?: string
}

//@ts-ignore
const UnauthorizedPopupContext = createContext<( options: Options ) => void>( null )

export function UnauthorizedPopupProvider( { children }: PropsWithChildren ){
    const [options, setOptions] = useState<Options>()
    const pathname              = usePathname()
    const { isVisible, toggle } = useModal()

    function unauthorizedAlert( options: Options ): void{
        setOptions( () => options )
        toggle()
    }

    return (
        <UnauthorizedPopupContext.Provider value={ unauthorizedAlert }>
            { children }
            <Modal visible={ isVisible } toggle={ toggle } hideIcon>
                <div className="h-full flex flex-col justify-center items-center text-center">
                    <div className="mb-4">
                        <LoginIcon fontSize="50" color="#FF1493"/>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-xl md:text-2xl mb-2">
                            { options?.title }
                        </h3>
                        <p className="text-gray-700">
                            { options?.message }
                        </p>
                    </div>
                    <div className="w-full mt-4">
                        <Link onClick={ toggle } href={ `/auth/login?redirect_to=${ pathname }` } className="mb-3 w-full inline-block">
                            <Button variant="contained" size="large" fullWidth>Log in</Button>
                        </Link>
                        <Link onClick={ toggle } href="/auth/signup" className="w-full inline-block">
                            <Button variant="outlined" size="large" fullWidth>Sign up</Button>
                        </Link>
                    </div>
                </div>
            </Modal>
        </UnauthorizedPopupContext.Provider>
    )
}

export default function useUnauthorizedAlert(){
    return useContext( UnauthorizedPopupContext )
}
