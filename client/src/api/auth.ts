import API                                                  from "@utils/API"
import { LoginFormData, ResetPassFormData, SignupFormData } from "@interfaces/auth.interfaces"

const authApi = {
    me: () => API.get( '/auth/me' ),
    signup: ( formData: SignupFormData ) => API.post( '/auth/signup', formData ),
    login: ( formData: LoginFormData ) => API.post( '/auth/login', formData ),
    loginWithGoogle: ( token: string ) => API.post( '/auth/google', { token } ),
    forgotPassword: ( email: string ) => API.post( '/auth/forgot_password', { email } ),
    resetPassTokenVerify: ( token: string ) => API.get( `/auth/reset_password/${ token }` ),
    resetPassword: ( formData: ResetPassFormData ) => API.post( `/auth/reset_password/${ formData.token }`, formData ),
    verifyAccount: ( token: string ) => API.get( `/auth/verify_account/${ token }` ),
    logout: () => API.get( '/auth/logout' )
}

export default authApi