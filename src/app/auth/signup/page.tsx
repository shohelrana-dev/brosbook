import { Metadata } from "next"
import Signup from "@components/auth/Signup"

export const metadata: Metadata = {
    title: 'Sign Up'
}

export default function SignupPage(){
    return (
        <Signup/>
    )
}
