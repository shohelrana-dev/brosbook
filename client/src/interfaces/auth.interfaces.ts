export interface CredentialPayload {
    username: string
    password: string
}

export interface SignupPayload {
    firstName: string
    lastName: string
    email: string
    username: string
    password: string
}

export interface ResetPassPayload {
    password: string
    confirmPassword: string
    email: string
    key: string
}

export interface LoginErrors {
    username?: { msg: string }
    password?: { msg: string }
}

export interface SignupErrors {
    firstName?: { msg: string }
    lastName?: { msg: string }
    email?: { msg: string }
    username?: { msg: string }
    password?: { msg: string }
    confirmPassword?: { msg: string }
}

export interface ForgotPasswordErrors {
    email?: { msg: string }
}

export interface ResetPasswordErrors {
    password?: { msg: string }
    confirmPassword?: { msg: string }
}