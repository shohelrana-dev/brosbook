import { Metadata } from "next"
import ForgotPassword from "@/components/auth/ForgotPassword"

export const metadata: Metadata = {
    title: 'Forgot Password'
}

export default function ForgotPasswordPage(){
    return (
        <ForgotPassword/>
    )
}
