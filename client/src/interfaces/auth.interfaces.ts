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