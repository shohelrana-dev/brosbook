import { Metadata } from "next"
import Login from "@components/auth/Login"

export const metadata: Metadata = {
    title: 'Login'
}

function LoginPage(){
    return (
        <Login/>
    )
}

export default LoginPage
