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
    token: string
}

export interface LoginErrors {
    username?: string
    password?: string
}

export interface SignupErrors {
    firstName?: string
    lastName?: string
    email?: string
    username?: string
    password?: string
    confirmPassword?: string
}

export interface ForgotPasswordErrors {
    email?: string
}

export interface ResetPasswordErrors {
    password?: string
    confirmPassword?: string
}