"use client"
import React from 'react'
import Link from "next/link"
import ButtonGray from "@components/global/ButtonGray"
import useAuthState from "@hooks/useAuthState"

function NewUserMessage(){
    const { isChecked, isAuthenticated } = useAuthState()

    if( isChecked && ! isAuthenticated ){
        return (
            <div className="box p-5">
                <h2 className="text-xl font-medium mb-2">New to { process.env.NEXT_PUBLIC_APP_NAME }?</h2>
                <p className="text-gray-800">Sign up now to get your own personalized timeline!</p>

                <Link href="/auth/signup">
                    <ButtonGray>
                        Goto Signup page
                    </ButtonGray>
                </Link>
            </div>
        )
    }

    return null
}

export default NewUserMessage